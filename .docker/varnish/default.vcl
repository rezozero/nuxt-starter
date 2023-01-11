vcl 4.1;

backend default {
    .host = "nginx";
    .port = "80";
}

sub vcl_recv {
    // Nuxt does not need any cookie
    unset req.http.cookie;

    # https://info.varnish-software.com/blog/varnish-cache-brotli-compression
    if (req.http.Accept-Encoding ~ "br" && req.url !~
        "\.(jpg|png|gif|zip|gz|mp3|mov|avi|mpg|mp4|swf|woff|woff2|wmf)$") {
        set req.http.X-brotli = "true";
    }

    if (req.http.Accept-Language) {
        if (req.http.Accept-Language ~ "fr") {
            set req.http.Accept-Language = "fr";
        } elsif (req.http.Accept-Language ~ "de") {
            set req.http.Accept-Language = "de";
        } elsif (req.http.Accept-Language ~ "en") {
            set req.http.Accept-Language = "en";
        }  elsif (req.http.Accept-Language ~ "es") {
            set req.http.Accept-Language = "es";
        } else {
            # unknown language. Remove the accept-language header and
            # use the backend default.
            unset req.http.Accept-Language;
        }
    }
}

# https://info.varnish-software.com/blog/varnish-cache-brotli-compression
sub vcl_hash {
    if (req.http.X-brotli == "true") {
        hash_data("brotli");
    }
}

# https://info.varnish-software.com/blog/varnish-cache-brotli-compression
sub vcl_backend_fetch {
    if (bereq.http.X-brotli == "true") {
        set bereq.http.Accept-Encoding = "br";
        unset bereq.http.X-brotli;
    }
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
    if (bereq.url ~ "\.(ico|css|js|woff2?|eot|ttf|otf|svg|gif|jpe?g|png|webp|mp4|avif|webm)$") {
        unset beresp.http.set-cookie;
    }
}
