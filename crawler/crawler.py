import urllib.request as url_request
from bs4 import BeautifulSoup as Soup
from pymongo import MongoClient as mc
from secret import get_secret

connect_string = get_secret()


class SneakyURLopener(url_request.FancyURLopener):
    version = "Mozilla/5.0"


def get_element(parent, el, attributes, i=0):
    container = parent.find_all(el, attributes)
    if len(container) > 0:
        return container[i]
    print('Failed to find element.\nel: %s\nattributes: %s' % (el, attributes))
    return None


def write_db(db_name, col_name, docs):
    client = mc(get_secret())
    db = client.get_database(db_name)
    col = db[col_name]
    col.insert_many(docs)


def upsert_db(db_name, col_name, docs):
    client = mc(get_secret())
    db = client.get_database(db_name)
    col = db[col_name]

    for doc in docs:
        thread_filter = {"thread_num": doc['thread_num']}
        col.find_one_and_update(thread_filter, {'$set': doc}, upsert=True)


def wipe_db(db_name, col_name):
    client = mc(get_secret())
    db = client.get_database(db_name)
    col = db[col_name]
    col.delete_many({})


def write_soup(filename, content):
    f = open(filename, "w", encoding='utf-8')
    f.write(content.prettify())
    f.close()


def main(is_test):
    # wipe_db('thread_db', 'threads')
    url_opener = SneakyURLopener()
    my_url = 'https://www.pathofexile.com/forum/view-forum/patch-notes'
    url_client = url_opener.open(my_url)
    page_html = url_client.read()
    url_client.close()

    page_soup = Soup(page_html, "html.parser")
    thread_container = page_soup.tbody.findAll("tr")

    threads_infos = []
    docs = []

    for thread in thread_container:
        title_container = get_element(thread, "div", {"class": "title"})
        title = title_container.a.text.strip()
        href = 'https://www.pathofexile.com' + title_container.a['href']
        post_date = get_element(
            thread, 'span', {'class': 'post_date'}).text.strip(',')
        author = get_element(thread, 'span', {'class': 'profile-link'}).a.text
        threads_infos.append((href, title, post_date, author))

    for url, title, post_date, author in threads_infos:
        url_client = url_opener.open(url)
        page_html = url_client.read()
        url_client.close()

        page_soup = Soup(page_html, "html.parser")
        content = get_element(page_soup, "tr", {})

        # redirect profile URLs
        profile_span = get_element(content, "span", {"class": "profile-link"})
        if profile_span:
            profile_a = profile_span.a
            new_a = page_soup.new_tag(
                "a", href="https://www.pathofexile.com" + profile_a['href'])
            profile_a.replace_with(new_a)

        thread_num = url.split('/')[-1].strip()
        html = content.prettify().replace('<br>', '').replace('</br>', '')
        docs.append({'thread_num': thread_num,
                     'title': title, 'html': html,
                     'text': content.text,
                     'post_date': post_date,
                     'author': author})

    upsert_db('thread_db', 'testing_zone' if test else 'threads', docs)


def test():
    pass


if __name__ == "__main__":
    main(False)
