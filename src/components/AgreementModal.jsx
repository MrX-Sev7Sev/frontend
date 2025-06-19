import React from 'react';
import ReactDOM from 'react-dom';

const AgreementModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Пользовательское соглашение</h2>
        <div className="modal-body">
          {/* Текст соглашения можно добавить здесь */}
          <p>
            Здесь будет текст пользовательского соглашения...
          </p>
        </div>
      </div>
    </div>,
    document.body // Рендерим модальное окно в body
  );
};

export default AgreementModal;