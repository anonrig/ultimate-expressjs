let isCoralogixInstalled = true

try {
    require.resolve('coralogix-logger')
} catch (e) {
    isCoralogixInstalled = false
}

module.exports = {
    isCoralogixInstalled
}