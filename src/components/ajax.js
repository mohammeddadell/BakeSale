const apiHost = 'https://bakesaleforgood.com';
export default {
async fetchInitialDeals (){
    try {

        const response = await fetch(apiHost + '/api/deals');
        const json = await response.json();
        return json;
      } catch (error) {
        console.error('ajax file', error);
      }
},

async fetchDealDetails(key) {
  try {
      const response = await fetch(apiHost + '/api/deals/' + key);
      const json = await response.json();

      return json;
    } catch (error) {
      console.error('ajax file', error);
    }
},

async fetchDealSearchResults(searchTerm) {
  try {
      const response = await fetch(apiHost + '/api/deals?searchTerm=' + searchTerm);
      const json = await response.json();

      return json;
    } catch (error) {
      console.error('ajax file', error);
    }
}
};