import React from 'react';

interface props {
  title: string;
}

function ExampleTSComponent({ title }: props) {
  return <div>{title}</div>;
}
