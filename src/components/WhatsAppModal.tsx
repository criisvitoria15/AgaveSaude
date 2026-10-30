import { useEffect, useRef, useState } from 'react';
import { buildWhatsAppUrl } from '../utils/schedule';

interface WhatsAppModalProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  selectedInterest?: string;
}

export default function WhatsAppModal({
  isOpen,
  onToggle,
  selectedInterest,
}: WhatsAppModalProps) {
  const [name, setName] = useState('');
  const [interest, setInterest] = useState('Emagrecimento');
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectedInterest) {
      setInterest(selectedInterest);
      setSubmittedUrl(null);
    }
  }, [selectedInterest]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggle(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  const handleSend = () => {
    const url = buildWhatsAppUrl(name, interest);
    setSubmittedUrl(url);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className={`wa${isOpen ? ' open' : ''}`} id="wa">
      <div className="wapanel" role="dialog" aria-label="Agendar pelo WhatsApp">
        <button
          className="wax"
          type="button"
          aria-label="Fechar"
          onClick={() => onToggle(false)}
        >
          ×
        </button>
        <h3>Agende sua consulta</h3>
        <p>Conte o que você procura e a equipe responde pelo WhatsApp.</p>
        <label htmlFor="wn">Seu nome</label>
        <input
          id="wn"
          ref={inputRef}
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSubmittedUrl(null);
          }}
        />
        <label htmlFor="ws">Interesse</label>
        <select
          id="ws"
          value={interest}
          onChange={(e) => {
            setInterest(e.target.value);
            setSubmittedUrl(null);
          }}
        >
          <option value="Emagrecimento">Emagrecimento</option>
          <option value="Cardiologia">Cardiologia</option>
          <option value="Nutrição">Nutrição</option>
          <option value="Performance, personal e Pilates">
            Performance, personal e Pilates
          </option>
          <option value="Estética avançada">Estética avançada</option>
          <option value="Outro assunto">Outro assunto</option>
        </select>
        <button
          className="btn"
          type="button"
          id="wgo"
          onClick={handleSend}
        >
          Enviar pelo WhatsApp
        </button>
        {submittedUrl && (
          <div className="wanote" id="wnote">
            Mensagem preparada!{' '}
            <a
              href={submittedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              Abrir conversa no WhatsApp
            </a>
          </div>
        )}
      </div>
      <button
        className="wafab"
        type="button"
        aria-label="Agendar pelo WhatsApp"
        aria-expanded={isOpen}
        onClick={() => onToggle(!isOpen)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        >
          <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" />
          <path
            fill="currentColor"
            stroke="none"
            d="M8.6 7.6c.3 2.7 3.100 5.500 5.800 5.800l1.300-1.300a.8.8 0 0 0 0-1.100l-1.200-.9a.8.8 0 0 0-1 0l-.6.500c-.9-.4-1.600-1.200-2-2.100l.5-.6a.8.8 0 0 0 0-1l-.9-1.200a.8.8 0 0 0-1.100 0z"
          />
        </svg>
      </button>
    </div>
  );
}
