vcl 4.1;

backend default {
    .host = "app";
    .port = "5000";
}

sub vcl_recv {
    // Nuxt does not need any cookie
    unset req.http.cookie;
}

sub vcl_backend_response {
    # Happens after we have read the response headers from the backend.
    #
    # Here you clean the response headers, removing silly Set-Cookie headers
    # and other mistakes your backend does.
    set beresp.grace = 2m;
    set beresp.keep = 8m;

    # Cache 404 for short period
    if (beresp.status == 404) {
        set beresp.ttl = 30s;
        unset beresp.http.Set-Cookie;
    }
    # strip the cookie before static asset is inserted into cache.
    if (bereq.url ~ "\.(png|webp|gif|jpg|swf|css|js|html|ico)$") {
        unset beresp.http.set-cookie;
    }
}
