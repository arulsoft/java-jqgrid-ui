package com.ivyinfo.session.bean;

import com.ivyinfo.framework.service.base.BaseBean;
import com.ivyinfo.mail.bean.SetupMailBean;
import com.ivyinfo.purview.bean.PurviewBean;
import com.ivyinfo.user.bean.UserBean;

public class SessionUserBean extends BaseBean implements java.io.Serializable{
	private static final long serialVersionUID = -4433034043604684279L;
	
	private PurviewBean purviewBean;
	private UserBean userBean;
	private SetupMailBean setupmailBean;
	
	public SetupMailBean getSetupmailBean() {
		return setupmailBean;
	}
	public void setSetupmailBean(SetupMailBean setupmailBean) {
		this.setupmailBean = setupmailBean;
	}
	public PurviewBean getPurviewBean() {
		return purviewBean;
	}
	public void setPurviewBean(PurviewBean purviewBean) {
		this.purviewBean = purviewBean;
	}
	public UserBean getUserBean() {
		return userBean;
	}
	public void setUserBean(UserBean userBean) {
		this.userBean = userBean;
	}
}
