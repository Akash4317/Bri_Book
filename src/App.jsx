import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

function App() {
  const [selectedFrontImage, setSelectedFrontImage] = useState(null);
  const [selectedBackImage, setSelectedBackImage] = useState(null);
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const handleFrontImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setSelectedFrontImage(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setSelectedBackImage(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (e, index) => {
    const updatedContent = [...content];
    updatedContent[index] = e.target.value;
    setContent(updatedContent);
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    let yOffset = 10;

    if (selectedFrontImage) {
      pdf.addImage(selectedFrontImage, 'JPEG', 10, 10, 180, 120);
      if (content.length > 0) {
        pdf.addPage();
      }
    }

    content.forEach((text, index) => {
      pdf.text(10, yOffset, text);
      if (index !== content.length - 1 || (index === content.length - 1 && selectedBackImage)) {
        pdf.addPage();
      }
      yOffset = 10;
    });

    if (selectedBackImage) {
      pdf.addImage(selectedBackImage, 'JPEG', 10, 10, 180, 120);
    }

    pdf.save("my_book.pdf");
  };



  const nextPage = () => {
    if (currentPage < content.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="App">
      <h1>Create Your Book</h1>
      <div className="book-container">
        <div className={`page ${currentPage === 0 && selectedFrontImage ? 'front-page' : ''}`} onClick={prevPage}>
          {currentPage === 0 && selectedFrontImage && (
            <img src={selectedFrontImage} alt="Front Cover" />
          )}
        </div>
        <div className="page" onClick={nextPage}>
          {currentPage < content.length && (
            <p>{content[currentPage]}</p>
          )}
          {content.length === 0 || currentPage === content.length ? (
            <img src={selectedBackImage} alt="Back Cover" />
          ) : null}
        </div>

      </div>
      <div className="file-input-container">
        <label htmlFor="frontImage">Select Front Cover Image:</label>
        <input type="file" id="frontImage" onChange={handleFrontImageChange} accept="image/*" />
        <label className="file-input-label" htmlFor="frontImage">Choose File</label>
      </div>

      <div className="file-input-container">
        <label htmlFor="backImage">Select Back Cover Image:</label>
        <input type="file" id="backImage" onChange={handleBackImageChange} accept="image/*" />
        <label className="file-input-label" htmlFor="backImage">Choose File</label>
      </div>

      <div>
        <h2>Add Content Pages:</h2>
        {content.map((pageContent, index) => (
          <textarea key={index} value={pageContent} onChange={(e) => handleContentChange(e, index)} />
        ))}
        <button onClick={() => setContent([...content, ''])}>Add Page</button>
      </div>
      <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  );
}

export default App;
