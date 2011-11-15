package test;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import php.java.servlet.RemoteHttpServletContextFactory;

/**
 * Servlet implementation class Hello
 */
public class Hello extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public Hello() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	request.getSession().setAttribute("i", 1);
        response.getWriter().write("HelloServlet is running!");
    }

    /**
     * @see HttpServlet#doPut(HttpServletRequest, HttpServletResponse)
     */
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        RemoteHttpServletContextFactory ctx =
                new RemoteHttpServletContextFactory(this, getServletContext(), request, request, response);

        response.setHeader("X_JAVABRIDGE_CONTEXT", ctx.getId());
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");

        try {
            ctx.handleRequests(request.getInputStream(), response.getOutputStream());
            request.getSession().setAttribute("i", 1);
        }
        finally {
            ctx.destroy();
        }
    }

    public String hello() {
        return "hello from MyServlet";
    }

}
