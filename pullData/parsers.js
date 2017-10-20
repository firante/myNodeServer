import axios from 'axios';
import cheerio from 'cheerio';
const parsers = {
  planetaKino() {
    axios.get('https://planetakino.ua/lvov/showtimes/')
      .then((response) => {
	const dom = cheerio.load(response.data);
	console.log(dom('.showtime-movie-container').html());
      })
      .catch(err => console.log(err));
  }
};

export default parsers;
