import {html, LitElement} from "lit";

export class Thread extends LitElement {

    static properties = {
        threadData: {type: Array},
    };

    constructor() {
        super();
    }

    createRenderRoot() {
        return this;
    }

    handleNewCommentEvent(event) {
        const comment = event.detail.comment;
        const index = event.detail.subjectIndex;

        const thread = this.threadData[index];

        const updatedThreadData = [...this.threadData];

        updatedThreadData[index] = {
            ...thread,
            threadComments: [...thread.threadComments, { comment, likes: 0 }]
        };

        //dispach event to main screen with the new comment
        this.dispatchEvent(new CustomEvent('update-threads-data', {
            detail: {
                updatedThreadData: updatedThreadData,
            }
        }));

        this.threadData = updatedThreadData;
        this.requestUpdate();
    }

    render() {
        return html`          
            
            ${this.threadData.map((data, index) => html`
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                    <div class="container">
                        <div class="row">
                            <div class="ps-4">
                                <span class="material-symbols-outlined">forum</span>
                                <h4>${data.threadSubject}</h4>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-1">
                                <span class="badge rounded-pill text-bg-info">${data.threadComments.length} comments</span>
                            </div>
                        </div>
                    </div>
                </button>
              </h2>
              <div id="collapse${index}"  class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <div class="container">
                        <div class="row">
                            <thread-comments-component .comments=${data.threadComments}></thread-comments-component>
                        </div>
                        <div class="row mt-3">
                            <add-new-comment-component .subjectIndex="${index}" @new-thread-comment="${this.handleNewCommentEvent}"></add-new-comment-component>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          `)}`;
    }
}

window.customElements.define('thread-component', Thread);