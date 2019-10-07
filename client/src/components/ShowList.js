import List from '@material-ui/core/List';
import React from 'react';

const ShowList = ({ showList, ShowComponent }) => (showList.length > 0 ? (
    <List>
      {showList
        .sort((a, b) => {
          const x = a.name.toLowerCase();
          const y = b.name.toLowerCase();
          if (x < y) {
            return -1;
          } if (x > y) {
            return 1;
          }
          return 0;
        })
        .map((show) => <ShowComponent key={show.id} show={show} />)}
    </List>
) : null);

export default ShowList;
