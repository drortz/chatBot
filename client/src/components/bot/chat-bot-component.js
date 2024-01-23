

export class ChatBotComponent {

    isQuestionAnswered(threadData, threadSubject) {
        return threadData.filter(data => data.threadSubject.toLowerCase() === threadSubject.toLowerCase()).length != 0
    }

    getHighestLikesComment(threadData, threadSubject) {
        const thread = threadData.find(thread => thread.threadSubject.toLowerCase() === threadSubject.toLowerCase());

        if (!thread || !thread.threadComments || thread.threadComments.length === 0) {
            return {};
        }

        // Initialize variables to keep track of the highest-liked comments
        let highestLikedComments = [];
        let maxLikes = 0;

        // Iterate through thread comments to find the highest-liked comments
        thread.threadComments.forEach(comment => {
            if (comment.likes > maxLikes) {
                // Found a comment with more likes, reset the array
                highestLikedComments = [comment];
                maxLikes = comment.likes;
            } else if (comment.likes === maxLikes) {
                // Found a comment with the same number of likes, add it to the array
                highestLikedComments.push(comment);
            }
        });

        return highestLikedComments;
    }

    areAllLikesSame(threadData, threadSubject) {
        const thread = threadData.find(thread => thread.threadSubject.toLowerCase() === threadSubject.toLowerCase());
        if (!thread || !thread.threadComments || thread.threadComments.length === 0) {
            return true;
        }

        return thread.threadComments.every(comment => comment.likes === thread.threadComments[0].likes);
    }

}