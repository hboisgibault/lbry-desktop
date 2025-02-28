import { connect } from 'react-redux';
import { doChannelMute } from 'redux/actions/blocked';
import { doCommentPin, doCommentModAddDelegate } from 'redux/actions/comments';
import { doOpenModal } from 'redux/actions/app';
import { doSetPlayingUri } from 'redux/actions/content';
import { doToast } from 'redux/actions/notifications';
import { makeSelectChannelPermUrlForClaimUri, makeSelectClaimIsMine, makeSelectClaimForUri } from 'lbry-redux';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectModerationDelegatorsById } from 'redux/selectors/comments';
import { selectPlayingUri } from 'redux/selectors/content';
import CommentMenuList from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  contentChannelPermanentUrl: makeSelectChannelPermUrlForClaimUri(props.uri)(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  playingUri: selectPlayingUri(state),
  moderationDelegatorsById: selectModerationDelegatorsById(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  clearPlayingUri: () => dispatch(doSetPlayingUri({ uri: null })),
  muteChannel: (channelUri) => dispatch(doChannelMute(channelUri)),
  pinComment: (commentId, claimId, remove) => dispatch(doCommentPin(commentId, claimId, remove)),
  commentModAddDelegate: (modChanId, modChanName, creatorChannelClaim) =>
    dispatch(doCommentModAddDelegate(modChanId, modChanName, creatorChannelClaim, true)),
  doToast: (props) => dispatch(doToast(props)),
});

export default connect(select, perform)(CommentMenuList);
