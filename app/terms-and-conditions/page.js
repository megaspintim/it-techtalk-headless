import ParallaxBg from '../../components/ParallaxBg';

const MASTHEAD_PHOTO = 'https://static.wixstatic.com/media/a2f082_879d00ebcad740ffb7407b8a0b36381d~mv2.avif';

export const metadata = {
  title: 'Terms and Conditions | IT-TechTalk'
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <section className="page-header">
        <ParallaxBg imageUrl={MASTHEAD_PHOTO} />
        <div className="wrap page-header-inner">
          <div className="breadcrumb">
            <a href="/">Home</a><span className="sep">/</span><span>Terms and Conditions</span>
          </div>
          <h1>Terms and Conditions</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="detail-main" style={{ maxWidth: 820 }}>
            <p>Access to and use of it-techtalk.com both within the UK and internationally is provided by the following terms:</p>

            <p>By using it-techtalk.com you agree to be bound on these terms, which shall take effect immediately on your first use of it-techtalk.com. If you do not agree to be bound by all of the following terms please do not access, use and/or contribute to it-techtalk.com.</p>

            <h2>Use of Trading Name IT-TechTalk</h2>
            <p>
              Quantum Technology Marketing Group Limited operates under the trading name IT-TechTalk for specific
              marketing activities. References to IT-TechTalk in our services, communications, or any agreements
              pertain to{' '}
              <a href="https://www.quantummarketing-group.com/" target="_blank" rel="noopener noreferrer">
                Quantum Technology Marketing Group Limited
              </a>
              . This includes obligations, rights, and responsibilities under these Terms and Conditions.
            </p>

            <p>
              Quantum Technology Marketing Group may change these terms from time to time and so you should check
              these terms regularly. Your continued use of it-techtalk.com will be deemed acceptance of the updated
              or amended terms. If you do not agree to the changes, you should cease using this website. If there is
              any conflict between these terms and specific local terms appearing elsewhere on it-techtalk.com then
              the latter shall prevail.
            </p>

            <h2>Use of it-techtalk.com</h2>
            <p>
              You agree to use it-techtalk.com only for the lawful purposes, and in a way that does not infringe the
              rights or, restrict or inhibit anyone else&rsquo;s use and enjoyment of it-techtalk.com. Prohibited
              behaviour includes harassing or causing distress or inconvenience to any person, transmitting obscene
              or offensive content or disrupting the normal flow of dialogue within it-techtalk.com.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All copyright, trade marks, design rights, patents and other intellectual property rights (registered
              and unregistered) in and on it-techtalk.com and all content (including all applications) located on
              the site shall remain vested in it-techtalk.com. You may not copy, reproduce, republish, disassemble,
              decompile, reverse engineer, download, post, broadcast, transmit, make available to the public, or
              otherwise use it-techtalk.com content in any way except for your own personal, non-commercial use. You
              also agree not to adapt, alter or create a derivative work from any it-techtalk.com content except for
              your own personal, non-commercial use. Any other use of it-techtalk.com content requires the prior
              written permission of{' '}
              <a href="https://www.quantummarketing-group.com/" target="_blank" rel="noopener noreferrer">
                Quantum Technology Marketing Group
              </a>
              .
            </p>

            <p>
              The names, images and logos identifying it-techtalk.com or third parties and their products and
              services are subject to copyright, design rights and trade marks of it-techtalk.com and/or third
              parties. Nothing contained in these terms shall be construed as conferring any licence or right to use
              any trade mark, design right or copyright of it-techtalk.com or any other third party.
            </p>

            <h2>Disclaimers and Limitations of Liability</h2>
            <p>
              it-techtalk.com content, including the information, names, images, pictures, logos and icons regarding
              or relating to it-techtalk.com, its products and services (or to third party products and services),
              is provided &ldquo;AS IS&rdquo; and on an &ldquo;AS AVAILABLE&rdquo; basis. To the extent permitted by
              law, it-techtalk.com excludes all representations and warranties (whether express or implied by law),
              including the implied warranties of satisfactory quality, fitness for a particular purpose,
              non-infringement, compatibility, security and accuracy.
            </p>

            <p>
              it-techtalk.com does not guarantee the timeliness, completeness or performance of the website or any
              of the content. While we try to ensure that all content provided by it-techtalk.com is correct at the
              time of publication no responsibility is accepted by or on behalf of it-techtalk.com for any errors,
              omissions or inaccurate content on the website.
            </p>

            <p>
              it-techtalk.com shall not be liable for any of the following losses or damages (whether such damage or
              losses were foreseen, foreseeable, known or otherwise); (a) loss of data; (b) loss of revenue or
              anticipated profits; (c) loss of business; (d) loss of opportunity; (e) loss of goodwill or injury to
              reputation; (f) losses suffered by third parties; or (g) any indirect, consequential, special or
              exemplary damages arising from the use of it-techtalk.com regardless of the form of action.
            </p>

            <p>
              it-techtalk.com does not warrant that functions available on it-techtalk.com will be uninterrupted or
              error free, that defects will be corrected, or it-techtalk.com or the server that makes it available
              are free of viruses or bugs. You acknowledge that it is your responsibility to implement sufficient
              procedures and virus checks (including anti-virus and other security checks) to satisfy your
              particular requirements for the accuracy of data input and output.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
