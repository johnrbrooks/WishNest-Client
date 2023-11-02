import './landingpage.scss';
import { useNavigate } from 'react-router-dom';
import { AiOutlineOrderedList } from 'react-icons/ai';
import { BsCheck2Square } from 'react-icons/bs';
import { ImEyeBlocked } from 'react-icons/im';
import { FaArrowRight } from 'react-icons/fa';

const LandingPage = () => {

    const navigate = useNavigate();

    return (
        <>
            <h1 className="page-title">WishNest</h1>
            <div className="landing-cta-grid-container">
                <div className="landing-cta-item">
                    <AiOutlineOrderedList className="landing-icon"/>
                    <h3>List your gifts</h3>
                    <p className="landing-benefit-details">
                        Make a list of all the gifts you'd like based on priority and cost
                        for family members to look at to purchase gifts.
                    </p>
                </div>
                <div className="landing-cta-item">
                    <BsCheck2Square className="landing-icon"/>
                    <h3>Mark as bought</h3>
                    <p className="landing-benefit-details">
                        Mark purchased gifts as bought so other family members don't buy
                        the same gift for the same person.
                    </p>
                </div>
                <div className="landing-cta-item">
                    <ImEyeBlocked className="landing-icon"/>
                    <h3>Restrict list access</h3>
                    <p className="landing-benefit-details">
                        Ensure the receiver cannot see what gifts have been purchased or not,
                        maintain the surprise!
                    </p>
                </div>
            </div>
            <button 
                className="primary CTA"
                onClick={() => navigate('/signin')}>
                    Start gifting better 
                    <FaArrowRight className="landing-arrow-icon"/>
            </button>

        </>
    )
}

export default LandingPage;