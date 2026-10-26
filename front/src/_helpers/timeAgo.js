const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto", style: "short" })

const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60]
]

// timeAgo(article.createdAt) -> "il y a 2 h", "hier", "il y a 3 j"...
export const timeAgo = (date) => {
    const seconds = Math.round((new Date(date) - Date.now()) / 1000)

    for (const [ unit, value ] of units) {
        if ( Math.abs(seconds) >= value ) {
            return rtf.format(Math.round(seconds / value), unit)
        }
    }
    return "à l'instant"
}
