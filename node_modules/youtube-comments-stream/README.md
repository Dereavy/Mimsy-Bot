# youtube-comments-stream

[![npm version](https://badge.fury.io/js/youtube-comments-stream.svg)](https://badge.fury.io/js/youtube-comments-stream)

Scrape comments (including replies) from a [YouTube](https://www.youtube.com/) video and present as a stream

## Purpose

This is a stream wrapper around [youtube-comment-api](https://github.com/philbot9/youtube-comment-api), which itself is a Promise wrapper around [youtube-comments-task](https://github.com/philbot9/youtube-comments-task)

It presents a readable object stream returning individual comments as objects. For a full description of the returned comment object see documentation for [youtube-comments-task](https://github.com/philbot9/youtube-comments-task)

## Installation

```sh
npm install --save youtube-comments-stream
```

## API Summary

The module contains four functions:

* [`get(VIDEO_ID)`](#getvideo_id): Get a readable stream of all comments from the video
* [`limit(MAX_COMMENTS)`](#limitmax_comments): Get a transform stream to limit the number of items in a comments stream
* [`filter(FILTER_FN)`](#filterfilter_fn): Get a transform stream to filter a comments stream
* [`mock(COMMENTS)`](#mockcomments): Get a mock comments stream (for testing)

## Examples

### Read all comments from a video

```js
const commentsStream = require('youtube-comments-stream');

const VIDEO_ID = 'HVv-oBN6AWA';

const stream = commentsStream(VIDEO_ID);

stream.on('data', function (comment) {
	console.log(comment.text);
});

stream.on('error', function (err) {
	console.error('ERROR READING COMMENTS:', err)
});

stream.on('end', function () {
	console.log('NO MORE COMMENTS');
	process.exit();
});
```

### Read only the first 5 comments from a video

```js
const commentsStream = require('youtube-comments-stream');

const VIDEO_ID = 'HVv-oBN6AWA';
const MAX_COMMENTS = 5;

const limit = commentsStream.limit(MAX_COMMENTS);
const stream = commentsStream.get(VIDEO_ID).pipe(limit);

stream.on('data', function (comment) {
	console.log(comment.text);
});

/* ... */
```

### Read comments by author

(that appear in the first 1000 video comments)

```js
const commentsStream = require('youtube-comments-stream');

const VIDEO_ID = 'kpaFizGUJg8';
const MAX_COMMENTS = 1000;
const AUTHOR = 'nokomis mn';

const limit = commentsStream.limit(MAX_COMMENTS);
const filter = commentsStream.filter(comment => comment.author === AUTHOR);
const stream = commentsStream.get(VIDEO_ID).pipe(limit).pipe(filter);

stream.on('data', function (comment) {
	console.log(comment.text);
});

/* ... */
```

### Read the first 8 comments that contain the text "NASA"

```js
const commentsStream = require('youtube-comments-stream');

const VIDEO_ID = 'ZuToYSYdJS0';
const REGEX = /nasa/i;
const MAX_COMMENTS = 8;

const filter = commentsStream.filter(comment => REGEX.test(comment.text));
const limit = commentsStream.limit(MAX_COMMENTS);
const stream = commentsStream.get(VIDEO_ID).pipe(filter).pipe(limit);

stream.on('data', function (comment) {
	console.log(comment.text);
});

/* ... */
```

## API Details

### `get(VIDEO_ID)`

Get a readable stream of all comments from the video

**VIDEO_ID** is the "v" parameter of the video URL, eg if the URL is https://www.youtube.com/watch?v=HVv-oBN6AWA then it is "HVv-oBN6AWA"

#### Module alias

For convenience the module itself is an alias for `get()`, ie

```js
const commentsStream = require('youtube-comments-stream');

const stream = commentsStream(VIDEO_ID);
// ...is exactly the same as
const stream = commentsStream.get(VIDEO_ID);
```

### `limit(MAX_COMMENTS)`

Get a transform stream to limit the number of items in a comments stream

**MAX_COMMENTS** is a numeric value. The stream will end once it has provided this number of comments or if it ends naturally before reaching this amount

### `filter(FILTER_FN)`

Get a transform stream to filter a comments stream

**FILTER_FN** is a function that receives a comment object as a parameter and returns a boolean, eg

```js
function isCommentByJohn(comment) {
	return comment.author === 'john';
}

const filter = commentsStream.filter(isCommentByJohn);
const stream = commentsStream.get(VIDEO_ID).pipe(filter);
```

or, using ES6, we can write this much more succinctly as

```js
const filter = commentsStream.filter(comment => comment.author === 'john');
const stream = commentsStream.get(VIDEO_ID).pipe(filter);
```

#### Order of filter/limit transforms

It should be clear that the order of transforms is significant, ie

```js
const limit = commentsStream.limit(10);
const filter = commentsStream.filter(comment => comment.author === 'john');

// get first 10 comments by john
const stream1 = commentsStream.get(VIDEO_ID).pipe(filter).pipe(limit);

// only get comments by john that are within the first 10 comments
const stream2 = commentsStream.get(VIDEO_ID).pipe(limit).pipe(filter);
```

### `mock(COMMENTS)`

Get a mock comments stream (for testing)

**COMMENTS** is an array of objects that will be returned by the mock stream, eg

```js
const mockComments = [
	{ author: 'john', text: 'Some comment' },
	{ author: 'jane', text: 'Another comment' },
	{ author: 'bob', text: 'An answer by bob' }
];

const mockStream = commentsStream.mock(mockComments);
```

#### Mocking errors

If a mock comment object contains a `type` which contains the word "error" then this will cause the mock stream to emit an error when it reads this comment, eg

```js
const mockComments = [
	{ author: 'john', text: 'Some comment' },
	{ author: 'jane', text: 'Another comment' },
	{ type: 'some error', message: 'whoops, something has gone wrong' }, // will emit an error
	{ author: 'bob', text: 'An answer by bob' }
];

const mockStream = commentsStream.mock(mockComments);
```
