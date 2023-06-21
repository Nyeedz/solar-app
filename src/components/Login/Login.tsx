import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../context/userState';
import { appTheme } from '../../styles/theme/theme';
import PhoneConfirmation from './PhoneConfirmation';
import styles from './login.module.scss';

type User = {
  cpf: string;
  isValid: boolean;
};

const Login: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useRecoilState<User>(userState);
  const [tempCpf, setTempCpf] = useState<string>('');
  const [showPhoneConfirmation, setShowPhoneConfirmation] =
    useState<boolean>(false);
  const [isValidationPending, setValidationPending] = useState(false);
  const [validationTimer, setValidationTimer] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setTempCpf(value);

      if (validationTimer) {
        clearTimeout(validationTimer);
      }

      setValidationPending(true);

      const timer = setTimeout(() => {
        setUser((prevUser) => ({
          ...prevUser,
          cpf: value,
          phone: '+55279*****864',
          isValid:
            /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$|^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2}$/.test(
              value
            ) || value === '',
        }));

        setValidationPending(false);
      }, 800);

      setValidationTimer(timer);
    },
    [setUser, validationTimer]
  );

  const handleContinue = useCallback(() => {
    if (user.isValid && tempCpf !== '') {
      setShowPhoneConfirmation(true);
    }
  }, [tempCpf, user.isValid]);

  const handlePhoneConfirmationComplete = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleContinue();
      }
    },
    [handleContinue]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  console.log(123);

  return (
    <>
      {showPhoneConfirmation ? (
        <PhoneConfirmation
          onVerificationComplete={handlePhoneConfirmationComplete}
        />
      ) : (
        <>
          <div className={styles['welcome-box']}>
            <h1 className={styles['welcome-box__title']}>
              Boas vindas a Solar
            </h1>
            <h3 className={styles['welcome-box__info']}>
              Insira seus dados para acessar a plataforma:
            </h3>
          </div>
          <div className={styles['login-container']}>
            <TextField
              inputProps={{
                style: {
                  fontSize: '1.6rem',
                  border: 'none',
                },
              }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              inputRef={inputRef}
              label="CPF/CNPJ"
              placeholder="CPF/CNPJ"
              value={tempCpf}
              error={!user.isValid}
              helperText={
                !user.isValid && user.cpf
                  ? 'Por favor, entre com um CPF/CNPJ válido'
                  : ''
              }
              onChange={handleInputChange}
              variant="standard"
              fullWidth
              onKeyDown={handleKeyDown}
            />
            <Button
              style={{
                marginTop: '87px',
                color: '#fff',
                fontSize: '20px',
                textTransform: 'capitalize',
              }}
              variant="contained"
              onClick={handleContinue}
              disabled={!user.isValid || tempCpf === '' || isValidationPending}
              fullWidth
              color="secondary"
            >
              Continuar
            </Button>
            <div className={styles['login-container__info']}>
              <span>
                Perdeu seu dispositivo? Fale com o{' '}
                <Link style={{ color: appTheme.palette.primary.main }} to="">
                  suporte
                </Link>
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
