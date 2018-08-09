module.exports = () => {
    const protocol = "";
    const login = "";
    const mdp = "";
    const url = "";
    const name = "";
    const connectUrl = `${protocol}://${login}:${mdp}@${url}/${name}`;
    return {
        protocol,
        login,
        mdp,
        url,
        name,
        connectUrl
    }
}