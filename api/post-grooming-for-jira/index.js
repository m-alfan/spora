import getGroomingData from './_get-grooming-data';
import patchIssue from './_patch-issue';

const { JIRA_URL, BOARD_ID, PROJECT_KEY } = process.env;

export default async (req, res) => {
  const { doc_id: docId } = req.body;

  const data = await getGroomingData(docId);

  await data.reduce(async (promise, issue) => {
    await patchIssue(issue.key, issue);
    await promise;
  }, Promise.resolve());

  res.json({
    description_adf: data[0].description_adf,
    notes_adf: data[0].notes_adf,
    url: new URL(`/secure/RapidBoard.jspa?rapidView=${BOARD_ID}&projectKey=${PROJECT_KEY}&view=planning.nodetail`, JIRA_URL).href,
  });
};
