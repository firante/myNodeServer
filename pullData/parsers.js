import axios from 'axios';
import cheerio from 'cheerio';
import Promise from 'bluebird';
import mongodb from 'mongodb';

const MONGO_URL = process.env.MONGO_URL;
const MongoClient = mongodb.MongoClient;

const parsers = {
  planetaKino() {
    axios.get('https://planetakino.ua/lvov/showtimes/')
      .then((response) => {
	const kingCross = [];
	const dom = cheerio.load(response.data);
	dom('.showtime-movie-container').each((index, value) => {
	  const film = {};
	  film.name = dom(value).find('.movie-title a').text();
	  film.city = 'Lviv';
	  film.place = 'King Cross Leopolis';
	  film.imageUrl = dom(value).find('.movi-title a img').data('vend');
	  film.dateTime = [];
	  dom(value).find('.showtimes-row').each((index, value) => {
	    const day = {};
	    day.date = dom(value).find('.dates .date').text().split(',')[0].trim();
	    day.tech = [];
	    dom(value).find('.showtimes-line .showtimes-line-technology').each((index, value) => {
	      const tech = {};
	      tech.techName = dom(value).find('.showtimes-line-technology-title').text();
	      tech.times = [];
	      dom(value).find('.showtimes-line-hours-wrapper .showtimes-line-hours a').each((index, value) => {
		const time = {};
		time.time = dom(value).text();
		time.href = dom(value).attr('href');
		tech.times.push(time);
		film.id = dom(value).data('id');
	      });
	      day.tech.push(tech);
	    });
	    film.dateTime.push(day);
	  });
	  kingCross.push(film);
	});
	MongoClient.connect(MONGO_URL, {promiseLibrary: Promise})
	  .catch(err => console.log(err.stack))
	  .then((db) => {
	    kingCross.forEach((value) => {
	      const findCriteria = {
		city: value.city,
		place: value.place,
		id: value.id
	      };
	      const cinemas = db.collection('cinemas');
	      cinemas.findOne(findCriteria)
		.then((record) => {
		  if(record) {
		    cinemas.update(findCriteria, { $set: { dateTime: value.dateTime } }, { multi: true  });
		  } else {
		    cinemas.insert(value);
		  }
		})
		.catch(err => console.log(err));
	    });
	  });
      })
      .catch(err => console.log(err));
  }
};

export default parsers;
