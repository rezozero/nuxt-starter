variable "REGISTRY" {
    default = "registry.xxxxxxx.com/group/project"
}

variable "VERSION" {
    default = ""
}

group "default" {
    targets = ["frontend"]
}


target "frontend" {
    name = "frontend-${item.name}"
    platforms = ["linux/amd64"]
    matrix = {
        item = [
            {
                name = "node"
                target = "node-prod"
            },
            {
                name = "nginx"
                target = "nginx-prod"
            },
        ]
    }
    context = "."
    dockerfile = "Dockerfile"
    target = item.target
    tags = [
            notequal(VERSION, "") ? "${REGISTRY}/frontend-${item.name}:${VERSION}" : "${REGISTRY}/frontend-${item.name}:develop",
            notequal(VERSION, "") ? "${REGISTRY}/frontend-${item.name}:latest" : "",
    ]
}
