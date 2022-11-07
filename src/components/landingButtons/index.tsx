import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';
import Link from 'next/link';

const ActionButton = ({
	path,
	variant,
	text,
}: {
	path: string;
	variant: string;
	text: string;
}) => {
	const item = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
		},
	};
	return (
		<>
			<motion.div transition={{ delay: 1 }} className="item" variants={item}>
				<Link href={path}>
					<Button variant={variant} className="me-4" size="lg">
						{text}
					</Button>
				</Link>
			</motion.div>
		</>
	);
};

export default ActionButton;
