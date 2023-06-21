import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { MouseEvent, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../context/userState';
import styles from './login.module.scss';
import { appTheme } from '../../styles/theme/theme';

type PhoneConfirmationProps = {
  onVerificationComplete: () => void;
};

const PhoneConfirmation: React.FC<PhoneConfirmationProps> = ({
  onVerificationComplete,
}) => {
  const [user] = useRecoilState(userState);
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill('')
  );
  const [showVerificationCode, setShowVerificationCode] =
    useState<boolean>(false);
  const [verificationError, setVerificationError] = useState(false);
  const [verificationErrorMessage, setVerificationErrorMessage] = useState('');

  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (showVerificationCode) {
      digitRefs.current[0]?.focus();
    }
  }, [showVerificationCode]);

  const handleConfirm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    simulateApiRequest().then((code) => {
      setVerificationCode(Array(6).fill('')); // Reset verificationCode to empty array
      setShowVerificationCode(true);
      digitRefs.current[0]?.focus();
    });
  };

  const handleVerificationCodeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value.slice(0, 1);
    setVerificationCode(newVerificationCode);

    if (value.length === 1 && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleVerificationCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'ArrowRight' && index < 5) {
      digitRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handleVerificationComplete = () => {
    const isValidCode = verificationCode.join('') === '123456';
    if (isValidCode) {
      onVerificationComplete();
    } else {
      setVerificationError(true);
      setVerificationErrorMessage(
        'Código incorreto. Verifique e tente novamente'
      );
    }
  };

  const simulateApiRequest = (): Promise<string> => {
    return new Promise((resolve) => {
      // Simulating API request delay
      setTimeout(() => {
        const mockVerificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        resolve(mockVerificationCode);
      }, 1000); // Delay of 1 second
    });
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: '44px',
    color: '#fff',
    fontSize: '20px',
    textTransform: 'capitalize',
  };

  return (
    <>
      <div className={styles['welcome-box']}>
        <h1 className={styles['welcome-box__title']}>
          Verificação de segurança
        </h1>
        <h3 className={styles['welcome-box__info--confirmation-phone']}>
          Para sua segurança, confirme se o seguinte número de telefone pertence
          a você:
        </h3>
      </div>
      {showVerificationCode ? (
        <div className={styles['login-container']}>
          <h3 className={styles['welcome-box__info--confirmation-phone']}>
            Enviamos um SMS com um código de 6 dígitos para{' '}
            <strong>+55279*****864</strong>
          </h3>
          <div className={styles['login-container__verification-code']}>
            {verificationCode.map((digit, index) => (
              <TextField
                key={index}
                variant="outlined"
                value={digit}
                onChange={(e) =>
                  handleVerificationCodeChange(
                    index,
                    e as React.ChangeEvent<HTMLInputElement>
                  )
                }
                onKeyDown={(e) =>
                  handleVerificationCodeKeyDown(
                    index,
                    e as React.KeyboardEvent<HTMLInputElement>
                  )
                }
                inputProps={{
                  style: {
                    height: '52px',
                    textAlign: 'center',
                  },
                }}
                inputRef={(ref) => (digitRefs.current[index] = ref)}
                error={verificationError && verificationCode[index] === ''}
              />
            ))}

            {verificationError && (
              <p className={styles['login-container__verification-error']}>
                Código incorreto. Verifique e tente novamente
              </p>
            )}
          </div>
          <Button
            style={buttonStyle}
            variant="contained"
            onClick={handleVerificationComplete}
            className={styles['login-container__button']}
            color="secondary"
            fullWidth
            disabled={verificationCode.includes('')}
          >
            Confirmar telefone
          </Button>
          <span className={styles['login-container__info']}>
            Perdeu seu dispositivo? Fale com o <Link to="">suporte</Link>
          </span>

          <div className={styles['login-container__resend-code']}>
            <Link style={{ color: appTheme.palette.primary.main }} to="">
              Reenviar código
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles['login-container']}>
          <div className={styles['login-container__phone']}>{user.phone}</div>
          <Button
            style={buttonStyle}
            variant="contained"
            onClick={handleConfirm}
            className={styles['login-container__button']}
            color="secondary"
            fullWidth
          >
            Confirmar telefone
          </Button>
          <span className={styles['login-container__info']}>
            Perdeu seu dispositivo? Fale com o{' '}
            <Link style={{ color: appTheme.palette.primary.main }} to="">
              suporte
            </Link>
          </span>
        </div>
      )}
    </>
  );
};

export default PhoneConfirmation;
