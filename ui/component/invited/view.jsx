// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import Button from 'component/button';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import { parseURI } from 'lbry-redux';
import { rewards as REWARDS, ERRORS } from 'lbryinc';

type Props = {
  user: any,
  fetchUser: () => void,
  claimReward: () => void,
  setReferrer: string => void,
  referrerSetPending: boolean,
  referrerSetError: string,
  channelSubscribe: (sub: Subscription) => void,
  history: { push: string => void },
  rewards: Array<Reward>,
};

function Invited(props: Props) {
  const {
    user,
    fetchUser,
    claimReward,
    setReferrer,
    referrerSetPending,
    referrerSetError,
    channelSubscribe,
    history,
    rewards,
  } = props;

  // useParams requires react-router-dom ^v5.1.0
  const { referrer } = useParams();
  const refUri = 'lbry://' + referrer.replace(':', '#');
  const referrerIsChannel = parseURI(refUri).isChannel;
  const rewardsApproved = user && user.is_reward_approved;
  const hasVerifiedEmail = user && user.has_verified_email;
  const referredRewardAvailable = rewards && rewards.some(reward => reward.reward_type === REWARDS.TYPE_REFEREE);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!referrerSetPending && hasVerifiedEmail) {
      claimReward();
    }
  }, [referrerSetPending, hasVerifiedEmail]);

  useEffect(() => {
    if (referrer) {
      setReferrer(referrer.replace(':', '#'));
    }
  }, [referrer]);

  // if they land here due to a referrer but already claimed, make them follow anyway
  useEffect(() => {
    if (!referredRewardAvailable && referrerIsChannel) {
      channelSubscribe({
        channelName: parseURI(refUri).claimName,
        uri: refUri,
      });
    }
  }, [referredRewardAvailable, referrerIsChannel]);

  function handleDone() {
    if (hasVerifiedEmail && referrerIsChannel) {
      channelSubscribe({
        channelName: parseURI(refUri).claimName,
        uri: refUri,
      });
    }
    history.push(`/$/${PAGES.DISCOVER}`);
  }

  if (referrerSetError === ERRORS.ALREADY_CLAIMED) {
    return (
      <Card
        title={__(`Welcome!`)}
        subtitle={referrerIsChannel ? __(`We've followed your referrer for you. Check it out!`) : __(`Congrats!`)}
        actions={
          <>
            {referrerIsChannel && (
              <div key={refUri} className="claim-preview--channel">
                <ClaimPreview key={refUri} uri={refUri} actions={''} type={'small'} />
              </div>
            )}
            <div className="card__actions">
              <Button button="primary" label={__('Done!')} onClick={handleDone} />
            </div>
          </>
        }
      />
    );
  }

  if (referrerSetError && referredRewardAvailable) {
    return (
      <Card
        title={__(`Welcome!`)}
        subtitle={__(
          `Something went wrong with your referral link. You can set and claim your referral reward after signing in.`
        )}
        actions={
          <>
            <p className="error-text">{__('Not a valid referral')}</p>
            <div className="card__actions">
              <Button
                button="primary"
                label={hasVerifiedEmail ? __('Verify') : __('Sign in')}
                navigate={`/$/${PAGES.AUTH}?redirect=/$/${PAGES.REWARDS}`}
              />
              <Button button="primary" label={__('Explore')} onClick={handleDone} />
            </div>
          </>
        }
      />
    );
  }

  if (!rewardsApproved) {
    return (
      <Card
        title={__(`You're invited!`)}
        subtitle={__(`A referral reward is waiting for you. Just complete sign-in to claim it.`)}
        actions={
          <>
            {referrerIsChannel && (
              <div key={refUri} className="claim-preview--channel">
                <ClaimPreview key={refUri} uri={refUri} actions={''} type={'small'} />
              </div>
            )}
            <div className="card__actions">
              <Button
                button="primary"
                label={hasVerifiedEmail ? __('Verify') : __('Sign in')}
                navigate={`/$/${PAGES.AUTH}?redirect=/$/${PAGES.INVITE}/${referrer}`}
              />
              <Button button="primary" label={__('Skip')} onClick={handleDone} />
            </div>
          </>
        }
      />
    );
  }

  return (
    <Card
      title={__(`Welcome!`)}
      subtitle={referrerIsChannel ? __(`We've followed your referrer for you. Check it out!`) : __(`Congrats!`)}
      actions={
        <>
          {referrerIsChannel && (
            <div key={refUri} className="claim-preview--channel">
              <ClaimPreview key={refUri} uri={refUri} actions={''} type={'small'} />
            </div>
          )}
          <div className="card__actions">
            <Button button="primary" label={__('Done!')} onClick={handleDone} />
          </div>
        </>
      }
    />
  );
}

export default Invited;
