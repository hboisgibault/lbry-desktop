// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as CS from 'constants/claim_search';
import { SIMPLE_SITE, ENABLE_NO_SOURCE_CLAIMS } from 'config';
import React from 'react';
import ChannelsFollowingDiscoverPage from 'page/channelsFollowingDiscover';
import ClaimListDiscover from 'component/claimListDiscover';
import Page from 'component/page';
import Button from 'component/button';
import Icon from 'component/common/icon';
import { splitBySeparator } from 'lbry-redux';
import { getLivestreamUris } from 'util/livestream';

type Props = {
  subscribedChannels: Array<Subscription>,
  tileLayout: boolean,
  activeLivestreams: ?LivestreamInfo,
  doFetchActiveLivestreams: () => void,
};

function ChannelsFollowingPage(props: Props) {
  const { subscribedChannels, tileLayout, activeLivestreams, doFetchActiveLivestreams } = props;

  const hasSubsribedChannels = subscribedChannels.length > 0;
  const channelIds = subscribedChannels.map((sub) => splitBySeparator(sub.uri)[1]);

  React.useEffect(() => {
    doFetchActiveLivestreams();
  }, []);

  return !hasSubsribedChannels ? (
    <ChannelsFollowingDiscoverPage />
  ) : (
    <Page noFooter fullWidthPage={tileLayout}>
      <ClaimListDiscover
        prefixUris={getLivestreamUris(activeLivestreams, channelIds)}
        hideAdvancedFilter={SIMPLE_SITE}
        streamType={SIMPLE_SITE ? CS.CONTENT_ALL : undefined}
        tileLayout={tileLayout}
        headerLabel={
          <span>
            <Icon icon={ICONS.SUBSCRIBE} size={10} />
            {__('Following')}
          </span>
        }
        defaultOrderBy={CS.ORDER_BY_NEW}
        channelIds={channelIds}
        meta={
          <Button
            icon={ICONS.SEARCH}
            button="secondary"
            label={__('Discover Channels')}
            navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
          />
        }
        showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS}
        hasSource
      />
    </Page>
  );
}

export default ChannelsFollowingPage;
