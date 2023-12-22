import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Publish } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { setLoadOpen } from '../slice';
import Info from '../FeatureInfo';
import LoadTable from './LoadTable';

function LoadButton({ editor, ...btnProps }) {
  const dispatch = useDispatch();
  const { loadOpen } = useSelector((state) => state[Info.ID]);

  const handleClick = useCallback(() => {
    dispatch(setLoadOpen(true));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(setLoadOpen(false));
  }, [dispatch]);

  return (
    <>
      {React.cloneElement(
        <Button startIcon={<Publish />} onClick={handleClick}>
          불러오기
        </Button>,
        btnProps,
      )}
      <LoadTable editor={editor} open={loadOpen} onClose={handleClose} />
    </>
  );
}

LoadButton.propTypes = {
  editor: PropTypes.object,
};

export default LoadButton;
