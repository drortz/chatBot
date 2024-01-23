import {html, LitElement} from "lit";

export class ThreadCommentsComponent extends LitElement{

    static properties = {
        comments: {type: Array}
    };

    constructor() {
        super();

    }

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('like-click', this.onLikeClick);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('like-click', this.onLikeClick);
    }

    onLikeClick(event) {
        event.detail.comment.likes++;
        this.requestUpdate();
    }
    render() {
        return html`
            ${this.comments.length === 0
            ? html` <p> <span class="material-symbols-outlined">error</span> No comments.</p>`
            : html`
                    <ul class="list-group">
                        ${this.comments.map((commentObj, index) => html`
                            <li class="list-group-item d-flex justify-content-between align-items-center pt-2">
                                <div class="container">
                                    <div class="row">
                                        <div class="col">
                                            <h5>${commentObj.comment}</h5>
                                        </div>
                                    </div>
                                    <div class="row" class="text-end">
                                        <div class="col">
                                            <span class="material-symbols-outlined" style="cursor: pointer"
                                                  @click="${() => this.dispatchEvent(new CustomEvent('like-click', { detail: { comment: commentObj } }))}">thumb_up</span>
                                            <span class="badge bg-primary rounded-pill">${commentObj.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        `)}
                    </ul>
                `}
        `;
    }
}

window.customElements.define('thread-comments-component', ThreadCommentsComponent);
