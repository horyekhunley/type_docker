import cors from "cors"
import express, {Application, Request, Response} from "express"
import ip from "ip"
import patientRoutes from "./routes/patient.routes"

export class App {
    private readonly app: Application
    private readonly APPLICATION_RUNNING = "Application running on:"
    private readonly ROUTE_NOT_FOUND = "Route not found"

    constructor(private readonly port: (number | string) = process.env.SERVER_PORT || 3000) {
        this.app = express()
        this.middleware()
        this.routes()

    }
    listen(): void {
        this.app.listen(this.port, () => {
            console.info(`${this.APPLICATION_RUNNING} ${ip.address()}:${this.port}`)
        })
    }

    private middleware(): void {
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: false}))
        this.app.use(cors({ origin: '*'}))
    }

    private routes(): void {
        this.app.use('/patients', patientRoutes)
        this.app.use('/', (req: Request, res: Response) => res.status(200).send({message: "Welcome to the API"}))
        this.app.all('*', (req: Request, res: Response) => res.status(404).send({message: this.ROUTE_NOT_FOUND}))

    }
}