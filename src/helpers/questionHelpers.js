import _ from 'lodash';
import Config from '../constants/config'
import moment from 'moment'

// Check if equal to 7 days
export const isModifyExpired = question => {
	const questionDate = moment(question.created)
	const dateNow = moment()

	if(dateNow.diff(questionDate, 'days') >= 7) {
		return true
	}
	else {
		return false
	}
}

// Check if question is deleted
export const isQuestionDeleted = question => question.title === 'deleted' && question.body === 'deleted';

// Is Post Tagged NSFW
export const isPostTaggedNSFW = post => {
  if (post.parent_permlink === 'nsfw') return true;

  const postJSONMetaData = _.attempt(JSON.parse, post.json_metadata);

  if (_.isError(postJSONMetaData) || postJSONMetaData === undefined) return false;
  if (_.isError(postJSONMetaData.tags) || postJSONMetaData.tags === undefined) return false;

  return _.includes(postJSONMetaData.tags, 'nsfw');
};

// Get Metadata or return default
export const getMetadata = question => {
  const questionJSONMetaData = _.attempt(JSON.parse, question.json_metadata);

  if (_.isError(questionJSONMetaData) || questionJSONMetaData === undefined) return Config.defaultMetadata

  return questionJSONMetaData;
};

// Filter By Votes
export const isQualityPost = question => {
	let isValid = false
	if(question.net_votes > -5) isValid = true
	return isValid
}

// Check if question or answer is What App By Tag
export const isWhatAppQuestionByParentPermlink = question => {
	const {parent_permlink} = question
	if(parent_permlink === Config.question.parentPermlink) return true
	else return false
};

// Check if question or answer is What App By Tag
export const isWhatAppAnswerByCategory = answer => {
	const {category} = answer
	if(category === Config.question.parentPermlink) return true
	else return false
};

// Check if question is What App question
export const isWhatAppQuestion = question => {
  const questionJSONMetaData = _.attempt(JSON.parse, question.json_metadata);

  if (_.isError(questionJSONMetaData) || questionJSONMetaData === undefined) return false;
  if (_.isError(questionJSONMetaData.app) || questionJSONMetaData.app === undefined) return false;

  return _.includes(questionJSONMetaData.app, 'what');
};

// Check if comment is What App answer
export const isWhatAppAnswer = answer => {
  const answerJSONMetaData = _.attempt(JSON.parse, answer.json_metadata);

  if (_.isError(answerJSONMetaData) || answerJSONMetaData === undefined) return false;
  if (_.isError(answerJSONMetaData.app) || answerJSONMetaData.app === undefined) return false;

  return _.includes(answerJSONMetaData.app, 'what');
};

// Check if question has a marked answer
export const hasMarkedAnswer = question => {
  const questionJSONMetaData = _.attempt(JSON.parse, question.json_metadata);

  if (_.isError(questionJSONMetaData) || questionJSONMetaData === undefined) return null;
  if (_.isError(questionJSONMetaData.answer) || questionJSONMetaData.answer === undefined) return null;
	if (!questionJSONMetaData.answer) return null;
	
  return questionJSONMetaData.answer;
};

// Check if question has a description
export const hasDescription = question => {
  const questionJSONMetaData = _.attempt(JSON.parse, question.json_metadata);

  if (_.isError(questionJSONMetaData) || questionJSONMetaData === undefined) return false;
  if (_.isError(questionJSONMetaData.description) || questionJSONMetaData.description === undefined) return false;

  return questionJSONMetaData.description;
};

// Check if question has a description
export const getDescription = question => {
  const questionJSONMetaData = _.attempt(JSON.parse, question.json_metadata);

  if (_.isError(questionJSONMetaData) || questionJSONMetaData === undefined) return '';
  if (_.isError(questionJSONMetaData.description) || questionJSONMetaData.description === undefined) return '';

  return questionJSONMetaData.description;
};

// Get Tags
export const getTags = question => {
	const questionJSONMetaData = _.attempt(JSON.parse, question.json_metadata);

	if (_.isError(questionJSONMetaData) || questionJSONMetaData === undefined) return [];
	if (_.isError(questionJSONMetaData.tags) || questionJSONMetaData.tags === undefined) return [];
	
	if(questionJSONMetaData.tags == 1) return [];

	return questionJSONMetaData.tags.slice(1);
}

// Get What Tags
export const getWhatTags = question => {
	const questionJSONMetaData = _.attempt(JSON.parse, question.json_metadata);

	if (_.isError(questionJSONMetaData) || questionJSONMetaData === undefined) return [];
	if (_.isError(questionJSONMetaData.tags) || questionJSONMetaData.tags === undefined) return [];
	
	if(questionJSONMetaData.tags == 2) return [];

	return questionJSONMetaData.tags.slice(2);
}

// Get What-App Category
export const getWhatCategory = question => {
	const questionJSONMetaData = _.attempt(JSON.parse, question.json_metadata);

	if (_.isError(questionJSONMetaData) || questionJSONMetaData === undefined) return 'what';
	if (_.isError(questionJSONMetaData.tags) || questionJSONMetaData.tags === undefined) return 'what';
	if (_.isError(questionJSONMetaData.tags[1])  || questionJSONMetaData.tags[1] === undefined) return 'what';
	
	return questionJSONMetaData.tags[1];
}

// Get Total Payout
export const getTotalPayout = question => {
	return parseFloat(question.pending_payout_value)+parseFloat(question.total_payout_value)
}

// Check If User Has Liked
export const checkUserHasLiked = (question, user) => {
	return _.find(question.active_votes, {voter: user})
}

// Truncate Text
export const truncateText = (text, length = 141, omission='...more') => {
  return _.truncate(text, {length, omission})
}

// Shorten Numbers
export const numFormatShort = ( number, precision = 0 ) => {
	let number_format;
	let suffix;
	if (number < 900) {
		// 0 - 900
		number_format = number.toFixed(precision);
		suffix = '';
	} else if (number < 900000) {
		// 0.9k-850k
		number_format = (number / 1000).toFixed(precision);
		suffix = 'K';
	} else if (number < 900000000) {
		// 0.9m-850m
		number_format = (number / 1000000).toFixed(precision);
		suffix = 'M';
	} else if (number < 900000000000) {
		// 0.9b-850b
		number_format = (number / 1000000000).toFixed(precision);
		suffix = 'B';
	} else {
		// 0.9t+
		number_format = (number / 1000000000000).toFixed(precision);
		suffix = 'T';
	}
	return `${number_format}${suffix}`;
}

// Contains Number Suffix
export const containsNumSuffix = num => {
  return num.match(/[a-z]/i);
}

// Lengthen Numbers
export const numFormatLong = n => {
	let n_format = n.slice(0, -1);
	let suffix = n[n.length -1];
	if(suffix === 'K'){
		n_format = parseFloat(n_format) * 1000;
	}else if(suffix.equals('M') == true){
		n_format = parseFloat(n_format) * 1000000;
	}else if(suffix.equals('B') == true){
		n_format = parseFloat(n_format) * 1000000000;
	}else{
		n_format = parseFloat(n_format) * 1000000000000;
	}
	
	return n_format;
}

// Select Currency
export const currencySelect = (currency, rates) => {
	switch(currency){
		case 'GBP': return {symbol: '£', rate: rates.GBP}
		case 'EUR': return {symbol: '€', rate: rates.EUR}
		case 'USD':
		default:
		 return {symbol: '$', rate: rates.USD}
	}
}