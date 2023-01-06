import {
    Container,
    Header,
  } from "semantic-ui-react";
  import { Link } from "react-router-dom";
  import { RoutePaths } from "../constants/RoutePaths";
  import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
  
  export const PdfPage = () => {
  
    return (
      <Container>
        <Link to={RoutePaths.HOME}>Home</Link>
        <Header as="h1" style={{ marginTop: "50px" }}>
          PDFデモ
        </Header>

        <Document file='https://yoheiyamazaki.s3.amazonaws.com/file/Attachment-1.pdf'>
          <Page pageNumber={1} />
        </Document>
      </Container>
    );
  };
  