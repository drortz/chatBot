import {LitElement, html} from 'lit';
import style from './main-screen.css.js';
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {ChatBotComponent} from "./bot/chat-bot-component.js";

export class MainScreen extends LitElement {

  static get properties() {
    return {
      threadData: {type: Array},
      frequentlyAskedQuestionData: {type: Array},
    };
  }

  constructor() {
    super();
    // this.createTestData();
    this.fetchUserQuestionsData();
    this.fetchfrequentlyAskedQuestionData();
    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        "Access-Control-Allow-Origin": "*"
    }});
    this.socket.on('new connection', console.log);
  }

  fetchUserQuestionsData() {
    const getDataApiUrl = 'http://localhost:3000/getAllData?index=users_questions';
    fetch(getDataApiUrl).then(response => {
      if (!response.ok) {
        this.threadData = [];
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
          this.threadData = data.hits.map(hit => hit._source);
    });
  }

  fetchfrequentlyAskedQuestionData() {
    const getDataApiUrl = 'http://localhost:3000/getAllData?index=frequently_asked_question';
    fetch(getDataApiUrl).then(response => {
      if (!response.ok) {
        this.frequentlyAskedQuestionData = [];
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      this.frequentlyAskedQuestionData = data.hits.map(hit => hit._source);
    });
  }

  static styles = [style];

  onButtonClick() {
    this.count++;
  }

  createRenderRoot() {
    return this;
  }

  highestLikesComment = [];
  otherComments = [];
  areAllCommentsLikesSame = false;

  handleNewThreadEvent(event) {
    const botComponent = new ChatBotComponent();
    const userQuestionsAndFaq = this.threadData.concat(this.frequentlyAskedQuestionData);
    document.getElementById("subjectTextArea").value = '';
    if (!botComponent.isQuestionAnswered(userQuestionsAndFaq, event.detail.subject)) {
      this.threadData = [...this.threadData, { threadSubject: event.detail.subject, threadComments: [] }];
      this.showNewThreadToast();
    } else {
      this.highestLikesComment = [];
      this.otherComments = [];

      this.highestLikesComment = botComponent.getHighestLikesComment(userQuestionsAndFaq, event.detail.subject);
      this.areAllCommentsLikesSame = botComponent.areAllLikesSame(userQuestionsAndFaq, event.detail.subject);

      const comments = userQuestionsAndFaq.filter(thread => thread.threadSubject.toLowerCase() === event.detail.subject.toLowerCase())[0];
      this.otherComments = comments.threadComments.filter(comment => !this.highestLikesComment.includes(comment));

      const existingThreadModal = new bootstrap.Modal(document.getElementById('existingThreadModal'));
      existingThreadModal.show();
      this.requestUpdate();
    }

    //close more comments collapse area
    const bsCollapse = new bootstrap.Collapse('#otherCommentsCollapse', {
      toggle: false
    });
    bsCollapse.hide();
  }

  showNewThreadToast() {
    const toastLiveExample = document.getElementById('newThreadToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  }

  handleUpdatedThreadDataEvent(event) {
    this.threadData = event.detail.updatedThreadData;
  }

  render() {
    return html`
    <div class="container justify-content-center pt-5">
      <div class="row">
        <img src="./../../resource/ChatBot_2.png" class="img-fluid" style="max-width: 10%;max-height: 10%">
        <div class="col">
          <div class="col"><h1>Welcome to Chat-Bot !</h1></div>
          <div class="col"><h5>Smart way to get an answeres based on previouse comments !</h5></div>
        </div>
      </div>
      <row>
        <div class="col text-center"><create-new-thread-component @new-thread-subject="${this.handleNewThreadEvent}"></create-new-thread-component></div>
      </row>
      <div class="row">
        <div class="col">
          <div class="card m-3">
            <div class="accordion" id="accordionExample">

              <thread-component .threadData=${this.threadData} @update-threads-data="${this.handleUpdatedThreadDataEvent}"></thread-component>

            </div>
            <div class="card-footer"><h6>Total threads: ${this.threadData?.length}</h6></div>
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
                    <!-- same likes amount-->
                    <div class="container">
                      <div class="row">
                        <div class="col-4"><img src="./../../resource/ChatBot.png" class="img-fluid" style="max-width: 80%;max-height: 80%" ></div>
                        <div class="col-8"><h5>Hey ! </h5><h5>I have found an answer/s for your question.</h5><p>Here are answers/s from other users !</p></div>
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
                    <!-- No same likes amount-->
                  <div class="container">
                    <div class="row">
                      <div class="col-4"><img src="./../../resource/ChatBot.png" class="img-fluid" style="max-width: 80%;max-height: 80%" ></div>
                      <div class="col-8"><h5>Hey !</h5><h5>I have found an answer/s for your question.</h5><p>The answer/s got the highest likes from other users !</p></div>
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
                    
                    <div class="row pt-1">
                      <p class="d-inline-flex gap-1">

                      <div class="row">
                        <div class="col-4"><img src="./../../resource/ChatBot.png" class="img-fluid" style="max-width: 80%;max-height: 80%" ></div>
                        <div class="col-8"><h5>Do you want to see other answers ?</h5></div>
                      </div>
                        
                        <button class="btn btn-link" type="button" data-bs-toggle="collapse"
                                data-bs-target="#otherCommentsCollapse" aria-expanded="false" aria-controls="otherCommentsCollapse"
                                ?disabled="${this.otherComments.length === 0}">
                          Yes please
                          <span class="material-symbols-outlined">double_arrow</span>
                        </button>
                      </p>
                      <div class="collapse" id="otherCommentsCollapse">

                        <div class="row">
                          <div class="col-4"><img src="./../../resource/ChatBot.png" class="img-fluid" style="max-width: 80%;max-height: 80%" ></div>
                          <div class="col-8"><h5>certainly.</h5><p>Here are more answers !</p></div>
                        </div>
                        
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
                      <div class="col"><img src="./../../resource/ChatBot.png" class="img-fluid" style="max-width: 80%;max-height: 80%" ></div>
                      <div class="col"><h5>No comments yet...<span class="material-symbols-outlined">sentiment_dissatisfied</span></h5><p>I will track for the best answer for you !</p></div>
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
