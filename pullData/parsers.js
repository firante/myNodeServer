import axios from 'axios';
import cheerio from 'cheerio';
const parsers = {
  planetaKino() {
    axios.get('https://planetakino.ua/lvov/showtimes/')
      .then((response) => {
	const dom = cheerio.load(response.data);
	dom('.showtime-movie-container').each(function(index, value) {
	  const name = dom(this).find('.movie-title a').text();
	  
	});
      })
      .catch(err => console.log(err));
  }
};

export default parsers;
