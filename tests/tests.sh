#!/usr/bin/env bash
# Lance les tests du projet Gardiennage des plantes.
#
#   ./tests.sh                 tous les tests
#   ./tests.sh unitaires       tests unitaires (API + front)
#   ./tests.sh integration     tests d'intégration (API + front)
#   ./tests.sh securite        tests de sécurité (API + front)
#   ./tests.sh orthographe     orthographe et typographie française
#   ./tests.sh qualite         ESLint + compilation du front
#   ./tests.sh aide            affiche cette aide
#
# Code de sortie : 0 si tout passe, 1 sinon (utilisable en intégration continue).

set -u
cd "$(dirname "$0")" || exit 1

VERT="\033[32m"; ROUGE="\033[31m"; GRAS="\033[1m"; FIN="\033[0m"
RESULTATS=()
ECHECS=0

# lancer "Nom affiché" dossier commande... : exécute la commande dans le dossier et note le résultat
lancer() {
    local nom="$1" dossier="$2"
    shift 2
    printf "\n${GRAS}▶ %s${FIN}\n" "$nom"
    if ( cd "$dossier" && "$@" ); then
        RESULTATS+=("${VERT}✔${FIN} $nom")
    else
        RESULTATS+=("${ROUGE}✖${FIN} $nom")
        ECHECS=$((ECHECS + 1))
    fi
}

# Les dépendances doivent être installées à la racine, dans api/ et dans front/
verifier_installation() {
    for dossier in . api front; do
        if [ ! -d "$dossier/node_modules" ]; then
            echo "Dépendances manquantes dans « $dossier » : lancez « npm install --prefix $dossier »"
            exit 1
        fi
    done
}

# Briques réutilisables : un fichier de tests de l'API, une catégorie de tests du front
tests_api()   { lancer "API — $1" api node --test --test-timeout=60000 "tests/$2.test.js"; }
tests_front() { lancer "Front — $1" front npx vitest run -t "^$2"; }

unitaires()   { tests_api "unitaires" unitaires;        tests_front "unitaires" "Unitaires"; }
integration() { tests_api "intégration" integration;    tests_front "intégration" "Intégration"; }
securite()    { tests_api "sécurité" securite;          tests_front "sécurité" "Sécurité"; }

orthographe() {
    lancer "Orthographe — dictionnaire (cspell)" . npx cspell --no-progress
    lancer "Orthographe — typographie et vocabulaire" . node --test tests/orthographe.test.js
}

qualite() {
    lancer "Qualité — ESLint" front npx eslint .
    lancer "Qualité — compilation" front npx vite build --logLevel error
}

resume() {
    printf "\n${GRAS}Résumé${FIN}\n"
    for ligne in "${RESULTATS[@]}"; do
        printf "  %b\n" "$ligne"
    done
    if [ "$ECHECS" -eq 0 ]; then
        printf "\n${VERT}${GRAS}Tout est vert.${FIN}\n"
    else
        printf "\n${ROUGE}${GRAS}%d étape(s) en échec.${FIN}\n" "$ECHECS"
    fi
}

case "${1:-tout}" in
    tout)
        verifier_installation
        orthographe; unitaires; integration; securite; qualite ;;
    unitaires|integration|securite|orthographe|qualite)
        verifier_installation
        "$1" ;;
    aide|-h|--help)
        sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
        exit 0 ;;
    *)
        echo "Catégorie inconnue : $1 (voir ./tests.sh aide)"
        exit 1 ;;
esac

resume
[ "$ECHECS" -eq 0 ]
