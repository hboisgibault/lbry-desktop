// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import OptimizedImage from 'component/optimizedImage';
import { STICKERS } from 'component/commentCreate/Stickers_part1/stickers';
import LbcSymbol from 'component/common/lbc-symbol';

type Props = {
  uri: string,
  closeModal: () => void,
  setIsReviewingStickerComment: (any) => void,
  setSelectedSticker: (any) => void,
};

class ModalLiveChatPicker extends React.PureComponent<Props> {
  render() {
    const { closeModal, setIsReviewingStickerComment, setSelectedSticker } = this.props;

    return (
      <Modal
        onAborted={closeModal}
        isOpen
        type="card"
        className="modal--live_picker"
        overlayClassName="modal-overlay--live_picker"
      >
        <div className="stickers__list">
          {STICKERS.map((stickerObj, index) => (
            <div className="stickers__row" key={index}>
              <div className="stickers__header" key={index}>
                <label>
                  {(index === 0 && __('Random')) ||
                    (index === 1 && __('Astronaut')) ||
                    (index === 2 && __('Pregnant Man')) ||
                    (index === 3 && __('Pregnant Woman')) ||
                    (index === 4 && __('Tips'))}
                </label>
              </div>
              <div className="stickers__items" key={index}>
                {index !== 4
                  ? Object.values(stickerObj).map((sticker) => (
                      <Button
                        key={Object.keys(STICKERS)[index]}
                        button="alt"
                        className="button--file-action"
                        onClick={() => {
                          setIsReviewingStickerComment(true);
                          setSelectedSticker(sticker);
                          closeModal();
                        }}
                      >
                        <OptimizedImage src={sticker} />
                      </Button>
                    ))
                  : stickerObj.map((stickerObj, index) => (
                      <div className="stickers__row" key={index}>
                        <div className="stickers__header" key={index}>
                          <LbcSymbol
                            postfix={
                              (index === 0 && __('<1')) ||
                              (index === 1 && __('1')) ||
                              (index === 2 && __('1~50')) ||
                              (index === 3 && __('50~100')) ||
                              (index === 4 && __('100~200')) ||
                              (index === 5 && __('200'))
                            }
                            size={14}
                          />
                        </div>
                        <div className="stickers__items" key={index}>
                          {Object.values(stickerObj).map((sticker) => (
                            <Button
                              key={Object.keys(STICKERS)[index]}
                              button="alt"
                              className="button--file-action"
                              onClick={() => {
                                setIsReviewingStickerComment(true);
                                setSelectedSticker(sticker);
                                closeModal();
                              }}
                            >
                              <OptimizedImage src={sticker} />
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    );
  }
}

export default ModalLiveChatPicker;
