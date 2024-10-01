module.exports = {
  devServer: {
    port: process.env.PORT || 8080, // Usa el puerto proporcionado por Railway o 8080 como fallback
    allowedHosts: 'all',            // Permite cualquier host
  }
}