import { LitElement, html, css } from 'lit';

class SpinnerComponent extends LitElement {

    static properties = {
        show: {type: Boolean}
    };

    constructor() {
        super();
        this.show = false;
    }

    firstUpdated() {
        const spinnerModal = new bootstrap.Modal(document.getElementById('spinnerModal'));
        spinnerModal.show();
    }

    static styles = css`
    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
  `;

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            ${this.show ? html `
                <div class="modal fade" id="spinnerModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            loading
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            ` : html ` `}
    `;
    }
}

window.customElements.define('spinner-component', SpinnerComponent);