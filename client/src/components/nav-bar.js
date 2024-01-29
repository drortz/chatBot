import {html, LitElement} from "lit";

export class NavBar extends LitElement {
    static properties = {

    };

    constructor() {
        super();
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html `
            <nav class="navbar navbar-expand-lg bg-primary-subtle">
                <div class="container-fluid">
                    
                    <a class="navbar-brand">BlueSky Airways</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link disabled" aria-disabled="true"> <span class="material-symbols-outlined">airplane_ticket</span> Book a flight</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link disabled" aria-disabled="true"><span class="material-symbols-outlined">book_online</span> My Booking</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link disabled" aria-disabled="true"><span class="material-symbols-outlined">how_to_reg</span> Check-In</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link disabled" aria-disabled="true"><span class="material-symbols-outlined">flight_takeoff</span> Flight Status</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href=""><span class="material-symbols-outlined">chat</span> Chat</a>
                            </li>
                        </ul>
                        <form class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        `;
    }
}

window.customElements.define('nav-bar', NavBar);