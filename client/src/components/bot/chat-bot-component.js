

export class ChatBotComponent {

    isQuestionAnswered(threadData, threadSubject) {
        return threadData.filter(data => data.threadSubject.toLowerCase() === threadSubject.toLowerCase()).length != 0
    }

    getHighestLikesComment(threadData, threadSubject) {
        const thread = threadData.find(thread => thread.threadSubject.toLowerCase() === threadSubject.toLowerCase());

        if (!thread || !thread.threadComments || thread.threadComments.length === 0) {
            return {};
        }

        const highestLikedComment = thread.threadComments.reduce((maxComment, currentComment) => {
            return currentComment.likes > maxComment.likes ? currentComment : maxComment;
        }, thread.threadComments[0]);

        return highestLikedComment;
    }

    areAllLikesSame(threadData, threadSubject) {
        const thread = threadData.find(thread => thread.threadSubject.toLowerCase() === threadSubject.toLowerCase());
        if (!thread || !thread.threadComments || thread.threadComments.length === 0) {
            return true;
        }

        return thread.threadComments.every(comment => comment.likes === thread.threadComments[0].likes);
    }

}