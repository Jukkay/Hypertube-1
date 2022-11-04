import { MouseEvent, useState } from 'react';
import { Button, FormCheck } from 'react-bootstrap';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { trpc } from '../../utils/trpc';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Inputs } from '../../types/appTypes';
import { Container, Card, Form, Row, Col, Image } from 'react-bootstrap';
import { MdAlternateEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { HiUser } from 'react-icons/hi';
import { AiOutlineMail } from 'react-icons/ai';
import { BsGithub } from 'react-icons/bs';
import { InferGetServerSidePropsType } from 'next';
import { signIn, getProviders } from 'next-auth/react';
import { flexColCenter } from '../../styles/styleVariables';

const Signup = ({
	providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const LogoPng = 'logo-hypertube/logo-no-background.png';
	const [passType, setPassType] = useState('password');

	const onEmailSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const email = getValues('email');
		console.log(email);
		const user = await signIn('email', {
			email: email,
			callbackUrl: 'http://localhost:3000/home',
		});
		console.log(user);
	};
	const schema = z.object({
		name: z.string().min(1, { message: 'Required' }),
		password: z.string().min(1, { message: 'Required' }),
		email: z.string().min(1, { message: 'Required' }),
	});

	const notifyDefault = () => toast.success('Activation email sent');

	const {
		watch,
		register,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting, isDirty, isValid },
	} = useForm<Inputs>({
		mode: 'onChange',
		resolver: zodResolver(schema),
	});

	const mutation = trpc.user.create.useMutation();

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		try {
			console.log(data);
			mutation.mutate({
				name: data.name,
				email: data.email,
				password: data.password,
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Container className="d-flex justify-content-center p-3 mb-4">
				<Card className="w-100 glass-background border-0">
					<Card.Body>
						<Row style={{ minHeight: '50vh' }}>
							<Col
								md="10"
								lg="6"
								className="order-2 order-lg-1 d-flex flex-column align-items-center mb-3 p-5"
							>
								<Card.Title className="display-5 text-dark mb-5">
									<strong>Sign up</strong>
								</Card.Title>
								<Form onSubmit={handleSubmit(onSubmit)}>
									<Form.Group className={flexColCenter}>
										<Container>
											<div className="d-flex flex-row align-items-center mb-4">
												<HiUser className="me-2 fs-4" />

												<div className="me-3">
													<Form.Control
														id="firstName"
														className="border-bottom comment-form bg-transparent"
														placeholder="Name"
														type="text"
														{...register('name')}
													></Form.Control>
												</div>
											</div>
											<div className="d-flex flex-row align-items-center mb-4 ">
												<MdAlternateEmail className="me-2 fs-4" />
												<div className="me-3">
													<Form.Control
														id="signupEmail"
														className="border-bottom comment-form bg-transparent"
														placeholder="Email"
														type="email"
														{...register('email')}
													></Form.Control>
												</div>
											</div>
											<div className="d-flex flex-row align-items-center mb-4 ">
												<RiLockPasswordFill className="me-2 fs-4" />
												<div className="me-3">
													<Form.Control
														placeholder="Password"
														className="border-bottom comment-form bg-transparent"
														id="signupPassword"
														type={passType}
														{...register('password')}
													/>
												</div>
											</div>
											<div className="mb-4">
												<FormCheck
													type="checkbox"
													label="show password"
													onClick={() =>
														passType === 'password'
															? setPassType('text')
															: setPassType('password')
													}
												/>
											</div>
										</Container>
										<div style={{ minHeight: '5vh' }}>
											<Button
												type="submit"
												variant="outline-warning"
												disabled={!isValid || !isDirty || mutation.isLoading}
											>
												Register
											</Button>
										</div>
									</Form.Group>
								</Form>
								{mutation.isError && <p>{mutation.error.message}</p>}
								{mutation.isSuccess && <p>User created</p>}
								<Container className="d-flex flex-column align-items-center justify-content-center p-3">
									<div className="d-flex">
										{providers &&
											Object.values(providers).map((provider) =>
												provider.name !== 'Credentials' &&
												provider.name !== 'Email' ? (
													<div className="p-1 mb-2" key={provider.name}>
														<Button
															className="d-flex align-items-center justify-content-center p-2"
															variant={
																provider.name === '42 School'
																	? 'primary'
																	: 'dark'
															}
															onClick={() =>
																signIn(provider.id, {
																	callbackUrl: 'http://localhost:3000/home',
																})
															}
														>
															<span className="me-2">Signup with </span>
															{provider.name === 'GitHub' && <BsGithub />}
															{provider.name === '42 School' && (
																<Image
																	src="/42.png"
																	style={{ maxWidth: '15px' }}
																/>
															)}
														</Button>
													</div>
												) : null
											)}
									</div>
									<div className="p-1 mb-2" key="Email">
										<Button
											variant="light"
											className="d-flex align-items-center justify-content-center p-2"
											onClick={onEmailSubmit}
										>
											<span className="me-2">Login with email </span>
											<AiOutlineMail />
										</Button>
									</div>
								</Container>
								<div>
									<p className="text-muted">
										Have an account? <Link href="/login">login</Link>
									</p>
								</div>
							</Col>
							<Col
								md="10"
								lg="6"
								className="order-1 order-lg-2 d-flex align-items-center justify-content-center"
							>
								<Card.Img src={LogoPng} className="w-75" />
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</Container>
		</>
	);
};

export async function getServerSideProps() {
	const providers = await getProviders();

	return {
		props: {
			providers,
		},
	};
}

export default Signup;
