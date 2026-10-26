// Message lisible à afficher à partir d'une erreur Axios
export const errorMessage = (error) => {
    if ( !error?.response ) {
        return "Serveur injoignable, réessayez plus tard"
    }
    return error.response.data?.message || "Une erreur est survenue"
}
