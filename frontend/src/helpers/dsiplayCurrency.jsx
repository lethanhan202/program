const displayCurrency = (number) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    })

    return formatter.format(number)
}

export default displayCurrency