export const api = ((req, res) => {
    res.json({
        status: 'awesome',
        name: 'Thor',
        strongestAvenger: true,
        likes: [
            'Hammers',
            'Getting hammered'
        ]
    })
})

export const status = ((req, res) => {
    res.json({
        status: 'ok',
        info: 'Thor was here.'
    })
})