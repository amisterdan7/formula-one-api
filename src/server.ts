import fastify from "fastify";
import cors from "@fastify/cors";
import { teams } from "./teams";

const server = fastify({ logger: true });

server.register(cors, {

    origin: "*", // qualquer pessoa pode consumir a api.
    
});

const drivers = [
    { id: 1, name: "Lewis Hamilton", teamId: 2 },
    { id: 2, name: "Max Verstappen", teamId: 3 },
    { id: 3, name: "Charles Leclerc", teamId: 1 },
    { id: 4, name: "Lando Norris", teamId: 4 },
];

server.get("/teams/", async (req, res) => {
    res.type("application/json").code(200)

    return [
        { id: 1, name: "Ferrari" }
    ]
});

server.get("/drivers/", async (req, res) => {
    res.type("application/json").code(200)

    return [ { id: 1, name: "Lewis Hamilton", team: { id: 1, name: "Ferrari" } } ]
})

interface DriverParams {
    id: string;
}

server.get<{Params: DriverParams}>("/drivers/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const driver = drivers.find(d => d.id === id);

    if(!driver) {
        res.type("application/json").code(404)
        return { error: "Driver not found" }
    } else {
        const team = teams.find(t => t.id === driver.teamId);
        res.type("application/json").code(200)
        return { id: driver.id, name: driver.name, team: team ? { id: team.id, name: team.name } : null }
    }

})

server.listen({ port: 3000 }, () => {
    console.log("Server init 3000")
})
