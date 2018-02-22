var Readable = require('stream').Readable;

function getCommentsStream(videoId, fetchCommentsPage) {
	var stream = new Readable({ objectMode: true });
	var commentsPage = null;
	var commentIndex = 0;
	var fetchNextPagePromise = null;

	function fetchNextComment() {
		// load first page and then return next comment
		if (!commentsPage) {
			return fetchNextPage().then(fetchNextComment);
		}
		// else, return next comment from current page
		if (commentsPage.comments.length > commentIndex) {
			return Promise.resolve(commentsPage.comments[commentIndex++]);
		}
		// else, load next page and then return next comment
		if (commentsPage.nextPageToken) {
			return fetchNextPage(commentsPage.nextPageToken).then(fetchNextComment);
		}
		// else, no more pages and no more comments
		return Promise.resolve(null);
	}

	function fetchNextPage(nextPageToken) {
		// if not already fetching next page then fetch it
		if (!fetchNextPagePromise) {
			fetchNextPagePromise = fetchCommentsPage(videoId, nextPageToken).then(function (_commentsPage) {
				fetchNextPagePromise = null;
				commentsPage = {
					comments: flattenComments(_commentsPage.comments),
					nextPageToken: _commentsPage.nextPageToken || null
				};
				commentIndex = 0;
			});
		}

		return fetchNextPagePromise;
	}

	stream._read = function () {
		fetchNextComment().then(function (comment) {
			stream.push(comment);
		}).catch(function (err) {
			stream.emit('error', err);
		});
	};

	return stream;
}

function flattenComments(comments) {
	return comments.reduce(function (arr, comment) {
		var commentClone = cloneComment(comment);
		var replies = (comment.replies || []).map(function (reply) {
			return cloneReply(reply, comment.id);
		});

		return arr.concat(commentClone, replies);
	}, []);
}

function cloneComment(comment) {
	var clone = Object.assign({}, comment);

	delete clone.replies;

	return clone;
}

function cloneReply(reply, replyTo) {
	var clone = Object.assign({}, reply, { replyTo });

	return clone;
}

module.exports = getCommentsStream;
