const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-token')


const generateRtcToken = (channelN) => {
  // Rtc Examples
  const appId = '52003bfaad2b412caaae9b88f9761367';
  const appCertificate = '0925ad883f584ab19dbafef8b46c260f';
  const channelName =channelN;
  const uid=Math.floor(Math.random() * (230)) + 1;
  const userAccount =null;
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600

  const currentTimestamp = Math.floor(Date.now() / 1000)

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

  // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

  // Build token with uid
  const tokenA = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      expirationTimeInSeconds,
      privilegeExpiredTs
    );
    console.log("Token With Integer Number Uid: " + tokenA);
    return { 'token': tokenA, 'uid': uid };
 

  // Build token with user account
  // const tokenB = RtcTokenBuilder.buildTokenWithUserAccount(
  //   appId,
  //   appCertificate,
  //   channelName,
  //   userAccount,
  //   role, 
  //   privilegeExpiredTs);
  // console.log("Token With UserAccount: " + tokenB);
}
module.exports = generateRtcToken;
