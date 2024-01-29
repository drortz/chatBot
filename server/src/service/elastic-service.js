import {Client} from "@elastic/elasticsearch";

export class ElasticService {

    elasticClient = new Client({
        node: 'https://80e96e76cabb42c49538ccd5f101728c.us-east-2.aws.elastic-cloud.com:443',
        auth: {
            user: 'ApiKey',
            apiKey: 'dWNSeFNJMEI0dzFkMU8wUmowTzY6SHg5ejRZYlJSYnFlY1VBU0x1cTFIZw=='
        }
    });

    async getAllData(indexName, res) {
        try {
            const body = await this.elasticClient.search({
                index: indexName,
                body: {
                    query: {
                        match_all: {},
                    },
                },
            }).then(response => {
                console.log(response);
                response = response.hits.hits;
                res.json({success: true, hits: response});
            }).catch(error => console.log(error));
        } catch (error) {
            console.error('Error fetching data from Elasticsearch:', error);
            res.status(500).json({success: false, error: 'Internal Server Error'});
        }
    }

    async deleteAllData(indexName, res) {
        try {
            const body = await this.elasticClient.deleteByQuery({
                index: indexName,
                body: {
                    query: {
                        match_all: {},
                    },
                },
            });

            if (body && body.deleted) {
                res.json({success: true, message: 'All documents deleted successfully'});
            } else {
                console.error('Unexpected response from Elasticsearch:', body);
                res.status(500).json({success: false, error: 'Internal Server Error'});
            }
        } catch (error) {
            console.error('Error deleting data from Elasticsearch:', error);
            res.status(500).json({success: false, error: 'Internal Server Error'});
        }
    }

    async upsertBulkThreads(indexName, req, res) {
        try {
            const upsertData = req.body.threadData;

            await this.elasticClient.helpers.bulk({
                datasource: upsertData,
                onDocument: (doc) => ({index: {_index: indexName}}),
            }).then(response => {
                res.status(200).json({success: true, message: 'All data have been inserted successfully'});
            });

        } catch (error) {
            console.error('Error inserting data to Elasticsearch:', error);
            res.status(500).json({success: false, error: 'Internal Server Error'});
        }
    }

    async upsertThread(indexName, req, res) {
        try {
            const upsertData = req.body;
            await this.elasticClient.index({
                index: indexName,
                body: upsertData
            }).then(response => {
                res.status(200).json({success: true, message: 'All data have been inserted successfully'});
            });
        } catch (error) {
            console.error('Error inserting data to Elasticsearch:', error);
            res.status(500).json({success: false, error: 'Internal Server Error'});
        }
    }

    async upsertComment(indexName, req, res) {
        try {
            const upsertData = req.body;
            const searchResult = await this.elasticClient.search({
                      index: 'users_questions',
                      body: {
                        query: {
                          match: {
                              threadSubject: upsertData.threadSubject
                          },
                        },
                      },
                    });
            if (searchResult.hits.total.value > 0) {
                const threadDocument = searchResult.hits.hits[0]._source;

                // Add the new comment to the existing comments array
                threadDocument.threadComments.push(upsertData.threadComments[0]);

                // Update the document with the new comments
                const updatedDocument = await this.elasticClient.update({
                    index: 'users_questions',
                    id: searchResult.hits.hits[0]._id,
                    body: {
                        doc: threadDocument,
                    },
                });

                res.status(200).json({success: true, message: 'New comment has been updated successfully.'});
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({success: true, message: 'Error: ' + error});
        }
    }
}