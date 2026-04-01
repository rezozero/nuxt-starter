export default defineEventHandler((event) => {
    // Allow the stories shell to iframe the frame app running on localhost:3000
    setHeader(event, 'Content-Security-Policy', "frame-src 'self' localhost:3000")
})
