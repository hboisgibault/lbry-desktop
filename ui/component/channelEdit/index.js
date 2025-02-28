import { connect } from 'react-redux';
import {
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectCoverForUri,
  makeSelectMetadataItemForUri,
  doUpdateChannel,
  doCreateChannel,
  makeSelectAmountForUri,
  makeSelectClaimForUri,
  selectUpdateChannelError,
  selectUpdatingChannel,
  selectCreateChannelError,
  selectCreatingChannel,
  selectBalance,
  doClearChannelErrors,
} from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import { doUpdateBlockListForPublishedChannel } from 'redux/actions/comments';
import { doClaimInitialRewards } from 'redux/actions/rewards';
import { selectIsClaimingInitialRewards, selectHasClaimedInitialRewards } from 'redux/selectors/rewards';
import ChannelForm from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  thumbnailUrl: makeSelectThumbnailForUri(props.uri)(state),
  coverUrl: makeSelectCoverForUri(props.uri)(state),
  description: makeSelectMetadataItemForUri(props.uri, 'description')(state),
  website: makeSelectMetadataItemForUri(props.uri, 'website_url')(state),
  email: makeSelectMetadataItemForUri(props.uri, 'email')(state),
  tags: makeSelectMetadataItemForUri(props.uri, 'tags')(state),
  locations: makeSelectMetadataItemForUri(props.uri, 'locations')(state),
  languages: makeSelectMetadataItemForUri(props.uri, 'languages')(state),
  amount: makeSelectAmountForUri(props.uri)(state),
  updateError: selectUpdateChannelError(state),
  updatingChannel: selectUpdatingChannel(state),
  createError: selectCreateChannelError(state),
  creatingChannel: selectCreatingChannel(state),
  balance: selectBalance(state),
  isClaimingInitialRewards: selectIsClaimingInitialRewards(state),
  hasClaimedInitialRewards: selectHasClaimedInitialRewards(state),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  updateChannel: (params) => dispatch(doUpdateChannel(params)),
  createChannel: (params) => {
    const { name, amount, ...optionalParams } = params;
    return dispatch(
      doCreateChannel('@' + name, amount, optionalParams, (channelClaim) => {
        dispatch(doUpdateBlockListForPublishedChannel(channelClaim));
      })
    );
  },
  clearChannelErrors: () => dispatch(doClearChannelErrors()),
  claimInitialRewards: () => dispatch(doClaimInitialRewards()),
});

export default connect(select, perform)(ChannelForm);
