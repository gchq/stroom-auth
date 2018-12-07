#!/bin/sh

add_to_headers() {
    token="$1"
    value="$2"
    if [ ! -z "${value}" ]; then
        echo "${token}:${value}" >> "${headers_file}"
    fi
}

main() {
    [ "$#" -eq 1 ] || (echo "'headers_file' argument not supplied!" && exit 1)
    headers_file="$1"

    # This command works in alpine linux 3.8, but may be fragile and subject to change
    # with different docker versions.
    container_id="$(grep -o -e "docker/.*" /proc/self/cgroup | head -n 1 | sed "s/docker\/\(.*\)/\\1/")"

    # Write the details of the host of this container to the headers file 
    # for stroom-log-sender
    cat /dev/null > "${headers_file}"

    # These two should be passed in as env vars at container run time 
    add_to_headers "OriginalHost" "${DOCKER_HOST_HOSTNAME}" 
    add_to_headers "OriginalIP" "${DOCKER_HOST_IP}" 
    # This env var should be automatcially set from the build arg at container creation time
    add_to_headers "OriginalImageGitTag" "${GIT_TAG}" 
    add_to_headers "OriginalContainerId" "${container_id}" 

    echo "Dumping ${headers_file} contents:"
    echo "-------------------------------------------"
    cat "${headers_file}"
    echo "-------------------------------------------"
}

main "$@"
