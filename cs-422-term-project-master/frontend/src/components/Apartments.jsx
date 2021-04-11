import React from 'react';
import { MDBDataTable } from 'mdbreact';
import Logo1 from '../images/Apartments_page1.jpg'
import Logo2 from '../images/Apartments_page2.jpg'
import Logo3 from '../images/Apartments_page3.jpg'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbreact/dist/css/mdb.css'


const DatatablePage = () => {
  const data = {
    columns: [
      {
        
        field: 'image',
        sort: 'asc',
        width: 100
      },
      {
        
        field: 'name',
        sort: 'asc',
        width: 500
      },
      {
       
        field: 'location',
        sort: 'asc',
        width: 500
      },
      {
       
        field: 'price',
        sort: 'asc',
        width: 500
      },
    ],
    rows: [
      {
        image: <img src= {Logo1} style= {{width: 150, height: 100}}></img> ,
        name: 'Dream Beach Cottage 1x1',
        location: 'Miami, Florida',
        price: '$2,000 per mo.',
      },
      {
        image: <img src= {Logo2} style= {{width: 150, height: 100}}></img>,
        name: 'Waverly Beach Villa 2x3',
        location: 'Malibu, California',
        price: '$3,000 per mo.',
      },
      {
        image: <img src= {Logo3} style= {{width: 150, height: 100}}></img>,
        name: 'Open Shore Villa 2x2',
        location: 'Palm Beach, Florida',
        price: '$2,500 per mo.',
      },
    ]
  };

  return (
    <MDBDataTable
      striped
      bordered
      small
      data={data}
    />
  );
}


export default DatatablePage;