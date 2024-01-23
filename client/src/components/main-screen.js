import {LitElement, html} from 'lit';
import style from './main-screen.css.js';
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {ChatBotComponent} from "./bot/chat-bot-component.js";

/**
 * An example element.
 */
export class MainScreen extends LitElement {
  static get properties() {
    return {
      threadData: {type: Array},
    };
  }

  constructor() {
    super();

    this.threadData = [];
    this.threadData.push({threadSubject: 'What is the best way to shovel snow ?',
      threadComments: [{comment: 'Using a snow blower !', likes: 1}, {comment: 'Using a snow shovel !', likes: 4}, {comment: 'With your hands :)', likes: 0}]});
    this.threadData.push({threadSubject: 'what is the most reliable car model ?',
      threadComments: [{comment: 'Mazda', likes: 2} , {comment: 'Toyota', likes: 4}, {comment: 'Porsche', likes: 6}, {comment: 'Suzuki', likes: 1}, {comment: 'Subaru', likes: 3}]});
    this.threadData.push({threadSubject: 'which day in a week is the best ?',
      threadComments: [{comment: 'Monday', likes: 0} , {comment: 'Sunday', likes: 5}, {comment: 'Saturday', likes: 4}]});
    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        "Access-Control-Allow-Origin": "*"
    }});
    this.socket.on('new connection', console.log);
  }

  static styles = [style];

  onButtonClick() {
    this.count++;
  }

  createRenderRoot() {
    return this;
  }

  // static get styles() {
  //   const { cssRules } = document.styleSheets[0]
  //   const globalStyle = css([Object.values(cssRules).map(rule =>
  //       rule.cssText).join('\n')])
  //   return [
  //     globalStyle,
  //     css`
  //     `
  //   ];
  // }
  highestLikesComment = [];
  otherComments = [];
  areAllCommentsLikesSame = false;

  handleNewThreadEvent(event) {
    const botComponent = new ChatBotComponent();
    document.getElementById("subjectTextArea").value = '';
    if (!botComponent.isQuestionAnswered(this.threadData, event.detail.subject)) {
      this.threadData = [...this.threadData, { threadSubject: event.detail.subject, threadComments: [] }];
      this.showNewThreadToast();
    } else {
      this.highestLikesComment = [];
      this.otherComments = [];

      this.highestLikesComment = botComponent.getHighestLikesComment(this.threadData, event.detail.subject);
      this.areAllCommentsLikesSame = botComponent.areAllLikesSame(this.threadData, event.detail.subject);

      // this.otherComments = this.threadData.filter(thread => thread.threadSubject.toLowerCase() === event.detail.subject)[0].
      //                       threadComments.filter(comment => comment.comment.toLowerCase() !== this.highestLikesComment.comment.toLowerCase());

      const comments = this.threadData.filter(thread => thread.threadSubject.toLowerCase() === event.detail.subject)[0];
      this.otherComments = comments.threadComments.filter(comment => !this.highestLikesComment.includes(comment));

      const existingThreadModal = new bootstrap.Modal(document.getElementById('existingThreadModal'));
      existingThreadModal.show();
      this.requestUpdate();
    }
  }

  showNewThreadToast() {
    const toastLiveExample = document.getElementById('newThreadToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
    // document.getElementById("subjectTextArea").value = '';
  }

  handleUpdatedThreadDataEvent(event) {
    this.threadData = event.detail.updatedThreadData;
  }

  render() {
    return html`
    <div class="container justify-content-center pt-5">
      <div class="row">
        <div class="col"><h1>chat</h1></div>
        <div class="col"><create-new-thread-component @new-thread-subject="${this.handleNewThreadEvent}"></create-new-thread-component></div>
        
      </div>
      <div class="row">
        
        <div class="col">
          
          <div class="card m-3">
            <div class="accordion" id="accordionExample">

              <thread-component .threadData=${this.threadData} @update-threads-data="${this.handleUpdatedThreadDataEvent}"></thread-component>

            </div>
            <div class="card-footer">Total threads ${this.threadData.length}</div>
          </div>
        </div>
      </div>
    </div>

    
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="newThreadToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">Confirmation</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          new thread has been added successfully !
        </div>
      </div>
    </div>

    <div class="modal fade" id="existingThreadModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <span class="material-symbols-outlined">info</span>
            <h1 class="modal-title fs-5" id="exampleModalLabel">This question has been already asked !</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            
            ${this.highestLikesComment[0] ?  html `

                  ${this.areAllCommentsLikesSame ? html `
                    <!-- same likes -->

                    <div class="container">
                      <div class="row">
                        <h5>Answer/s: </h5>
                      </div>
                      ${this.otherComments.concat(this.highestLikesComment).map((comment, index) => html`
                        <div class="card mt-3">
                          <div class="card-body">
                            <div class="row">
                              <h6>${comment.comment}</h6>
                            </div>
                          </div>
                          <div class="card-footer">
                            <div class="row">
                              <div class="col-1">
                                <span class="material-symbols-outlined">thumb_up</span>
                              </div>
                              <div class="col-1">
                                <p>${comment.likes}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      `)}
                    </div>
                    
                    
                    
                  ` : html `
                    <!-- No same likes -->
                  <div class="container">
                    <div class="row">
                      <h5>The Highest ranked Answer/s: </h5>
                    </div>
                    ${this.highestLikesComment.map(comment => html`
                      <div class="row">
                        <div class="card">
                          <div class="card-body">
                            <div class="row">
                              <h6>${comment.comment}</h6>
                            </div>
                          </div>
                          <div class="card-footer">
                            <div class="row">
                              <div class="col-1">
                                <span class="material-symbols-outlined">thumb_up</span>
                              </div>
                              <div class="col-1">
                                <p>${comment.likes}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    `)}
                    
                    <div class="row pt-3">
                      <p class="d-inline-flex gap-1">
                        <button class="btn btn-info" type="button" data-bs-toggle="collapse"
                                data-bs-target="#otherCommentsCollapse" aria-expanded="false" aria-controls="otherCommentsCollapse"
                                ?disabled="${this.otherComments.length === 0}">
                          Show me other comments
                          <span class="material-symbols-outlined">double_arrow</span>
                        </button>
                      </p>
                      <div class="collapse" id="otherCommentsCollapse">

                        ${this.otherComments.map((comment, index) => html`
                        <div class="card">
                          <div class="card-body">
                            <div class="row">
                              <h6>${comment.comment}</h6>
                            </div>
                          </div>
                          <div class="card-footer">
                            <div class="row">
                              <div class="col-1">
                                <span class="material-symbols-outlined">thumb_up</span>
                              </div>
                              <div class="col-1">
                                <p>${comment.likes}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      `)}
                      </div>
                    </div>
                  </div>
                  `}
              
                `
                : html `
                  <div class="container">
                    <div class="row">
                      <h5>But no comments yet...<span class="material-symbols-outlined">sentiment_dissatisfied</span></h5>
                    </div>
                  </div>
                `}
            
            
            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    
    `;
  }
}

window.customElements.define('main-screen', MainScreen);
